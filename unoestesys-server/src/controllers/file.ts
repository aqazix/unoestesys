import { writeFile } from "fs";
import os from "os";
import path from "path";
import { NextFunction, Request, Response } from "express";
import database from "../database/connection";
import { parseJWT } from "../utils/authorization";

export default class File {
  export = async (request: Request, response: Response) => {
    let token = request.headers.authorization?.split("Bearer ")[1];

    const { role_id } = parseJWT(token ? token : "");

    if (role_id === 1) {
      const data = await database
        .distinct()
        .select([
          "s.name as disciplina",
          "c.name as curso",
          "u.name as professor",
          "a.day as data",
          "t.hour as hora",
          "m.number as modulo",
        ])
        .from("appointment as a")
        .join("subject as s", "a.subject_id", "=", "s.id")
        .join("subjects as ss", "ss.subject_id", "=", "s.id")
        .join("course as c", "ss.course_id", "=", "c.id")
        .join("user as u", "a.user_id", "=", "u.id")
        .join("time as t", "a.time_id", "=", "t.id")
        .join("module as m", "a.module_id", "=", "m.id");
      const lines = ["Curso;Disciplina;Professor;Data;Hora;Módulo"];

      data.forEach((data) => {
        const date = new Date(data.data).toLocaleDateString("pt-BR");
        const module =
          data.modulo === 5 || data.modulo === 6
            ? data.modulo === 6
              ? 2
              : 1
            : data.modulo;
        lines.push(
          `${data.curso};${data.disciplina};${data.professor};${date};${data.hora};${module}`
        );
      });
      const filename = path.join(__dirname, "spreadsheet.csv");

      writeFile(filename, lines.join(os.EOL), () => {
        response.setHeader("content-type", "application/csv");
        response.status(200).sendFile(path.join(__dirname, "spreadsheet.csv"));
      });
    } else
      response.status(401).json({
        code: 300,
        message: "A operação desejada não é permitida.",
      });
  };
}
