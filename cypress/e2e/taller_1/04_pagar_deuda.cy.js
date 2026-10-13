describe('Caso 4 - Bill Pay', () => {
  it('paga un servicio desde la última cuenta', () => {
    const username = 'juan_' + Date.now()
    const password = 'Test1234'

    // Registro
    cy.visit('https://parabank.parasoft.com/parabank/register.htm')
    cy.get('input[name="customer.firstName"]').type('Juan')
    cy.get('input[name="customer.lastName"]').type('Perez')
    cy.get('input[name="customer.address.street"]').type('Calle 10 # 5-20')
    cy.get('input[name="customer.address.city"]').type('Tunja')
    cy.get('input[name="customer.address.state"]').type('Boyaca')
    cy.get('input[name="customer.address.zipCode"]').type('150001')
    cy.get('input[name="customer.phoneNumber"]').type('3001234567')
    cy.get('input[name="customer.ssn"]').type('123456789')
    cy.get('input[name="customer.username"]').type(username)
    cy.get('input[name="customer.password"]').type(password)
    cy.get('input[name="repeatedPassword"]').type(password)
    cy.get('input[value="Register"]').click()
    cy.contains('Your account was created successfully').should('be.visible')

    // Cerrar sesión
    cy.contains('a', 'Log Out').click()

    // Login
    cy.get('input[name="username"]').type(username)
    cy.get('input[name="password"]').type(password)
    cy.get('input[value="Log In"]').click()
    cy.url().should('include', '/overview.htm')

    // Abrir cuenta de ahorros (para tener más de una cuenta)
    cy.visit('https://parabank.parasoft.com/parabank/openaccount.htm')
    cy.get('#type').select('SAVINGS')
    cy.get('#fromAccountId option').should('have.length.greaterThan', 0)
    cy.get('#fromAccountId option').first().invoke('val').then((id) => {
      cy.get('#fromAccountId').select(id)
    })
    cy.get('input[value="Open New Account"]').click()
    cy.get('#openAccountResult').should('contain', 'Account Opened!')

    // Bill Pay
    cy.visit('https://parabank.parasoft.com/parabank/billpay.htm')
    cy.get('input[name="payee.name"]').type('Empresa de Energia')
    cy.get('input[name="payee.address.street"]').type('Carrera 9 # 20-15')
    cy.get('input[name="payee.address.city"]').type('Tunja')
    cy.get('input[name="payee.address.state"]').type('Boyaca')
    cy.get('input[name="payee.address.zipCode"]').type('150001')
    cy.get('input[name="payee.phoneNumber"]').type('3109876543')
    cy.get('input[name="payee.accountNumber"]').type('12345')
    cy.get('input[name="verifyAccount"]').type('12345')
    cy.get('input[name="amount"]').type('10')

    // Seleccionar la última cuenta y validar que quedó seleccionada
    cy.get('select[name="fromAccountId"] option').should('have.length.greaterThan', 0)
    cy.get('select[name="fromAccountId"] option').last().invoke('val').then((id) => {
      cy.get('select[name="fromAccountId"]').select(id)
      cy.get('select[name="fromAccountId"]').should('have.value', id)
    })

    cy.get('input[value="Send Payment"]').click()

    // Validaciones
    cy.get('#billpayResult').should('contain', 'Bill Payment Complete')
    cy.get('#payeeName').should('contain', 'Empresa de Energia')
  })
})