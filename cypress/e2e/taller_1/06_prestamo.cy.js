describe("Caso 6 - Solicitar préstamo", () => {
  it("solicita un préstamo con la última cuenta", () => {
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

    // Abrir cuenta de ahorros
    cy.visit("https://parabank.parasoft.com/parabank/openaccount.htm");
    cy.get("#type").select("SAVINGS");
    cy.get("#fromAccountId option").should("have.length.greaterThan", 0);
    cy.get("#fromAccountId option")
      .first()
      .invoke("val")
      .then((id) => {
        cy.get("#fromAccountId").select(id);
      });
    cy.get('input[value="Open New Account"]').click();
    cy.get("#openAccountResult").should("contain", "Account Opened!");

    // Solicitar préstamo
    cy.visit("https://parabank.parasoft.com/parabank/requestloan.htm");
    cy.get("#amount").type("100");
    cy.get("#downPayment").type("10");

    // Seleccionar la última cuenta
    cy.get("#fromAccountId option").should("have.length.greaterThan", 0);
    cy.get("#fromAccountId option")
      .last()
      .invoke("val")
      .then((id) => {
        cy.get("#fromAccountId").select(id);
        cy.get("#fromAccountId").should("have.value", id);
      });

    cy.get('input[value="Apply Now"]').click();

    // Validaciones
    cy.get("#requestLoanResult").should("contain", "Loan Request Processed");
    cy.get("#loanStatus").should("contain", "Approved");
  });
});
