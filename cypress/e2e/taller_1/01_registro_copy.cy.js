describe("ParaBank - Registro y Login", () => {
  // Datos del usuario (el username es único en cada ejecución)
  const user = {
    firstName: "Juan",
    lastName: "Perez",
    street: "Calle 10 # 5-20",
    city: "Tunja",
    state: "Boyaca",
    zipCode: "150001",
    phone: "3001234567",
    ssn: "123456789",
    username: `juan_${Date.now()}`,
    password: "Test1234",
  };

  it("registra un usuario y luego inicia sesión con datos válidos", () => {
    // ---------- 1. REGISTRO ----------
    cy.visit("https://parabank.parasoft.com/parabank/register.htm");

    cy.get('input[name="customer.firstName"]').type(user.firstName);
    cy.get('input[name="customer.lastName"]').type(user.lastName);
    cy.get('input[name="customer.address.street"]').type(user.street);
    cy.get('input[name="customer.address.city"]').type(user.city);
    cy.get('input[name="customer.address.state"]').type(user.state);
    cy.get('input[name="customer.address.zipCode"]').type(user.zipCode);
    cy.get('input[name="customer.phoneNumber"]').type(user.phone);
    cy.get('input[name="customer.ssn"]').type(user.ssn);
    cy.get('input[name="customer.username"]').type(user.username);
    cy.get('input[name="customer.password"]').type(user.password, {
      log: false,
    });
    cy.get('input[name="repeatedPassword"]').type(user.password, {
      log: false,
    });

    // Interceptar la petición de registro
    cy.intercept("POST", "**/parabank/register.htm").as("registro");

    cy.get('input[value="Register"]').click();

    // Esperar y validar la petición
    cy.wait("@registro").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    // Validación del registro
    cy.contains("h1", `Welcome ${user.username}`).should("be.visible");
    cy.contains("Your account was created successfully").should("be.visible");

    // ---------- 2. CERRAR SESIÓN ----------
    cy.contains("a", "Log Out").click();
    cy.get('input[name="username"]').should("be.visible");

    // ---------- 3. LOGIN ----------
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password, { log: false });
    cy.get('input[value="Log In"]').click();

    // Validación del login
    cy.url().should("include", "/overview.htm");
    cy.contains("h1", "Accounts Overview").should("be.visible");
    cy.screenshot("01-login-exitoso"); // Tomar captura de pantalla del login exitoso
    cy.contains("a", "Log Out").should("be.visible");
  });
});
