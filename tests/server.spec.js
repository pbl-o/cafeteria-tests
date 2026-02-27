const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {
  it("GET/cafes satus code = 200 & tipo de dato = Array & Array.length >= 1", async () => {
    //Request:
    const { body, statusCode } = await request(server).get("/cafes").send();
    //Status code:
    const status = statusCode;
    //elemento dentro del request
    const cafe = body;
    //tamaño del Array:
    const cantidadCafes = cafe.length;

    //revisar statusCode
    expect(status).toBe(200);

    //Doble revisión: es una instancia de tipo array?
    expect(cafe).toBeInstanceOf(Array);
    // Exclusivamente un array? (Object también pasa el test, por tanto aquí se filtra))
    expect(Array.isArray(cafe)).toBe(true);

    //Desde que el length no sea 0, el test pasa.
    expect(cantidadCafes).not.toBe(0);
  });

  /*

1- test sin jwt => Error (received status code = 400),
2-test con jwt y revisión de headers (funciona)

*/
  it("DELETE/cafes/:id devuelve status code 404 si id no existe", async () => {
    //token
    const jwt = "token";
    //id (> 5 no existe)
    const id = Math.floor(Math.random() * 100 + 5);
    //request + headers de consulta (Authoirzation y el token):
    const { statusCode } = await request(server)
      .delete(`/cafes/${id}`)
      .set("Authorization", jwt)
      .send();
    //status:
    const status = statusCode;
    expect(status).toBe(404);
  });

  it("POST/cafes agregar producto y devuelve status code 201", async () => {
    let numRandId = `${Math.floor(Math.random() * 2000)}${Date.now()}`;

    //se modela el body del request
    const cafe = { id: numRandId, nombre: "Esto es un café" };
    //se modela el request
    const { body, statusCode } = await request(server)
      .post("/cafes")
      .send(cafe);

    //Se usa un request extra para evaluar el post:
    const { body: result } = await request(server).get("/cafes").send(cafe);

    //verificar si al nuevo request (GET) se le ha agregado el nuevo elemento
    expect(result).toContainEqual(cafe);
    expect(statusCode).toBe(201);
  });

  it("PUT/cafes devuelve status code 400 con id de parametros != id de payload", async () => {
    // id del payload.
    const idReq = Math.floor(Math.random() * 100 + 5);
    //id del body:
    const idBody = `${Math.floor(Math.random() * 100 + 5)}-a`;
    //elementos modificados:
    const cafe = { id: idBody, nombre: "cafe verde" };
    const { body: result, statusCode } = await request(server)
      .put(`/cafes/${idReq}`)
      .send(cafe);

    const status = statusCode;
    expect(status).toBe(400);
  });

/*   //afterAll
  afterAll((done) => {
    server.close(done);
  }); */
  
});
