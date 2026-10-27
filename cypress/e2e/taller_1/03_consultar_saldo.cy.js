describe("Caso 3 - Consultar saldo", () => {
  it("consulta el saldo del periodo actual con tipo All", () => {
    const username = "juan_" + Date.now();
    const password = "Test1234";

    // Registro
    cy.visit("https://parabank.parasoft.com/parabank/register.htm");
    cy.get('input[name="customer.firstName"]').type("Juan");
    cy.get('input[name="customer.lastName"]').type("Perez");
    cy.get('input[name="customer.address.street"]').type("Calle 10 # 5-20");
    cy.get('input[name="customer.address.city"]').type("Tunja");
    cy.get('input[name="customer.address.state"]').type("Boyaca");
    cy.get('input[name="customer.address.zipCode"]').type("150001");
    cy.get('input[name="customer.phoneNumber"]').type("3001234567");
    cy.get('input[name="customer.ssn"]').type("123456789");
    cy.get('input[name="customer.username"]').type(username);
    cy.get('input[name="customer.password"]').type(password);
    cy.get('input[name="repeatedPassword"]').type(password);
    cy.get('input[value="Register"]').click();
    cy.contains("Your account was created successfully").should("be.visible");

    // Cerrar sesión
    cy.contains("a", "Log Out").click();

    // Login
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('input[value="Log In"]').click();
    cy.url().should("include", "/overview.htm");

    // Account Overview
    cy.visit("https://parabank.parasoft.com/parabank/overview.htm");
    cy.contains("h1", "Accounts Overview").should("be.visible");

    // Entrar al detalle de la primera cuenta
    cy.get('#accountTable a[href*="activity.htm"]').first().click();

    // Periodo presente y tipo All
    cy.get("#month").select("octubre");
    cy.get("#transactionType").select("All");
    cy.get('input[value="Go"]').click();

    // Validaciones
    cy.get("#balance").should("be.visible").and("contain", "$");
    cy.get("#availableBalance").should("be.visible");
  });
});
