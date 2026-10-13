describe('Caso 5 - Find Transactions', () => {
  it('busca transacciones por cuenta, id, fecha, rango de fecha y cantidad', () => {
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

    // Abrir cuenta de ahorros
    cy.visit('https://parabank.parasoft.com/parabank/openaccount.htm')
    cy.get('#type').select('SAVINGS')
    cy.get('#fromAccountId option').should('have.length.greaterThan', 0)
    cy.get('#fromAccountId option').first().invoke('val').then((id) => {
      cy.get('#fromAccountId').select(id)
    })
    cy.get('input[value="Open New Account"]').click()
    cy.get('#openAccountResult').should('contain', 'Account Opened!')

    // Bill Pay (para generar una transacción)
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
    cy.get('select[name="fromAccountId"] option').should('have.length.greaterThan', 0)
    cy.get('select[name="fromAccountId"] option').last().invoke('val').then((id) => {
      cy.get('select[name="fromAccountId"]').select(id)
      cy.get('select[name="fromAccountId"]').should('have.value', id)
    })
    cy.get('input[value="Send Payment"]').click()
    cy.get('#billpayResult').should('contain', 'Bill Payment Complete')

    // Ver la transacción en el detalle de la última cuenta para leer su fecha e id
    cy.visit('https://parabank.parasoft.com/parabank/overview.htm')
    cy.get('#accountTable a[href*="activity.htm"]').last().click()
    cy.get('#month').select('All')
    cy.get('#transactionType').select('All')
    cy.get('input[value="Go"]').click()

    cy.get('#transactionTable tbody tr').first().then((fila) => {
      const fecha = fila.find('td').eq(0).text().trim()
      const idTransaccion = fila.find('a').attr('href').match(/[?&]id=(\d+)/)[1]

      // 5a. Por cuenta
      cy.visit('https://parabank.parasoft.com/parabank/findtrans.htm')
      cy.get('#accountId option').last().invoke('val').then((idCuenta) => {
        cy.get('#accountId').select(idCuenta)
        cy.get('#accountId').should('have.value', idCuenta)
      })

      // 5b. Por ID de transacción
      cy.get('#transactionId').type(idTransaccion)
      cy.get('#findById').click()
      cy.get('#transactionTable').should('be.visible')

      // 5c. Por fecha
      cy.visit('https://parabank.parasoft.com/parabank/findtrans.htm')
      cy.get('#transactionDate').type(fecha)
      cy.get('#findByDate').click()
      cy.get('#transactionTable').should('be.visible')

      // 5d. Por rango de fecha
      cy.visit('https://parabank.parasoft.com/parabank/findtrans.htm')
      cy.get('#fromDate').type(fecha)
      cy.get('#toDate').type(fecha)
      cy.get('#findByDateRange').click()
      cy.get('#transactionTable').should('be.visible')

      // 5e. Por cantidad (el monto del pago fue 10)
      cy.visit('https://parabank.parasoft.com/parabank/findtrans.htm')
      cy.get('#amount').type('10')
      cy.get('#findByAmount').click()
      cy.get('#transactionTable').should('be.visible')
    })
  })
})