# Unoeste Sys

![picture alt](https://media.giphy.com/media/cgC6Mx1aJtBBe/giphy.gif "so said the master!")

> a system to rule them all

## Table of contents

 - [About](#about)
 - [How to collaborate](#how-to-collaborate)
 - [To do](#to-do)
 - [Error codes](#error-codes)
 - [List of errors](#list-of-errors)

## About

UnoesteSys is a system that is currently being developed and maintained by the NEAD/Unoeste CCPM dev team.

With the purpose of grouping several local subsystems, such as:

 - Chat - Future
 - Contracts - In the development queue
 - Employee management - Future
 - Form Management - Future
 - Schedules - (Work in progress - 40%) :rocket:
 - Tasks - Future

### How to collaborate

To collaborate on this project, talk to those responsible first :shipit:, then clone the repo:

```
git clone https://github.com/aqazix/unoestesys.git
```

After cloning the repository, you must install the software development dependencies.

You should note that there are two folders inside the repository, one is the application server and the other is the web part, which contains the components.

With your terminal you must enter both and install the dependencies with the following command:

```
npm i --save-dev
```

That done, you're ready to run! Within server / web type the following command:

```
npm start
```

Now just contribute! :feelsgood:

### To do

 - Transform the others pages into styled components;
 - At `/manage-subject`, when editing a subject, the `add` and `remove professor` buttons should toggle between themselves when you click them. Besides, if the user is a professor (Professxr), only show the subjects that it is responsible for;
 - At `/schedule`, implement the `selector` (change pages, handle next/prev page treatment) and `result` (filter by module, substitute modules icons and create a search function (see `/manage-subject` for reference)) functions. Besides, if the user is a professor (Professxr), only show the subjects and courses that it is responsible for;
 - At `/calendar`, mark days that have already has schedules (and make those that can't be scheduled anymore distinct). Besides, if the user is a professor (Professxr), only allow the subjects that it is responsible for to be edited;
 - Clean and optimize the code;
 - Create the following functions:
   * `Notifications`;
   * `Contracts`;
   * `Roles`;
   * `Forms`;
   * `Users`;
   * `Profiles`;
   * `Chat`.
 - Adjust the responsive.

### Error codes

When a request fails in the server, it responds with an object containing an error code and a message, that should be exhibited for the user. The following is a list of said errors and their messages.

**Categories**
 1. 1** Logic errors (faulty logic or misunderstandings of external function's usage). They accompany an Error object of the related function;
 2. 2** User errors (wrong or wrongly formated input).
 3. 3** Authorization errors (operations technically possible but not permited).

### List of errors

 - Code: 100:
   - Message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
   - Meaning: There's an error in an external function (Knex, Bcrypt, Express, etc.) and it couldn't be completed;
 - Code: 101:
   - Message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
   - Meaning: There's an error in the function's logic that made it crash;
 - Code: 200
   - Message: "Senha incorreta."
   - Meaning: The password that the user sent doesn't match with the provided email
 - Code: 201
   - Message: "Não há usuários cadastrados com esse e-mail."
   - Meaning: No user was found with the email provided
 - Code: 202
   - Message: "Preencha todos os campos: "
   - Meaning: The user hasn't filled all required fields. The message lists all missing fields
 - Code: 203
   - Message: "A chave de recuperação de senha expirou."
     Meaning: The user has taken too long to recover their password or someone is trying to access an expired token
 - Code 204
   - Message: "O horário desejado já está reservado."
   - Meaning: The user has tried to schedule a webconference in an already reserved time slot
 - Code: 300
   - Message: "A operação desejada não é permitida."
     Meaning: The user has tried (through non official channels) perform a non authorized operation
 - Code: 301
   - Message: "Nenhum token foi enviado com a requisição."
     Meaning: The user has made a requsition but no token was sent with it
