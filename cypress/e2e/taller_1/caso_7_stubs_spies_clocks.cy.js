describe("Caso 7 - Stubs, Spies y Clocks", () => {
  it("Demostración de Spies y Stubs en window", () => {
    cy.visit("https://parabank.parasoft.com/parabank/index.htm");

    cy.window().then((win) => {
      // 1. STUB: Reemplaza la función alert para que no bloquee la prueba
      cy.stub(win, "alert").as("alertStub");
      // 2. SPY: Espía la función console.log
      cy.spy(win.console, "log").as("consoleSpy");

      // Ejecutamos las funciones para que el spy y el stub registren la acción
      win.alert("Hola, soy un Stub");
      win.console.log("Hola, soy un Spy");
    });

    // Validaciones
    cy.get("@alertStub").should(
      "have.been.calledOnceWith",
      "Hola, soy un Stub",
    );
    cy.get("@consoleSpy").should(
      "have.been.calledOnceWith",
      "Hola, soy un Spy",
    );
  });

  it("Demostración de Clock (Control del tiempo)", () => {
    cy.visit("https://parabank.parasoft.com/parabank/index.htm");

    // 3. CLOCK: Congelamos el tiempo
    cy.clock();

    cy.window().then((win) => {
      const now = win.Date.now();
      cy.log("Tiempo inicial congelado: " + new Date(now).toISOString());
    });

    // Avanzamos el tiempo 10 segundos (10000 milisegundos)
    cy.tick(10000);

    cy.window().then((win) => {
      const later = win.Date.now();
      cy.log(
        "Tiempo después de cy.tick(10000): " + new Date(later).toISOString(),
      );
    });
  });
});
