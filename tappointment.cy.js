//FRONTEND TESTS
describe('Tappointment frontend tests', () => {

  let baseUrl = 'http://booklender.000webhostapp.com'

  it("Status 200", () => {
    cy.request({
      url: baseUrl,
    }).then((resp) => {
      expect(resp.status).to.eq(200)
    })
  })

  it("Status 404 if wrong url is given", () => {
    cy.request({
      url: baseUrl + "/asdf.php",
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.eq(404)
    })
  })

  it('Element found', () => {
    cy.visit(baseUrl)
    cy.get('.floating')
  })

  it('Non-existing element not found', () => {
    cy.visit(baseUrl)
    cy.get('.asdf').should('not.exist');
  })

  it('Form filled and posted', () => {
    cy.visit(baseUrl)

    cy.intercept('POST', 'index.php').as('login')

    cy.get('input[name="username"]').type('admin')
    cy.get('input[name="pass"]').type('admin')
    cy.get('input[value="Log in"]').click()

    cy.wait('@login')
    .its('response')
    .then((response) => {
      const { statusCode, body } = response
      expect(statusCode).to.eq(200)

    cy.get('a[href="logout.php"]').click({force: true})
    })
    
  })

})

//API TESTS ON NUMBERSAPI
describe('Tappointment API tests', () => {

  let baseUrl = "http://numbersapi.com/"

  //STATUS 200
  it("Status 200 with correct data given", () => {
    cy.request({
      url: baseUrl + "42?json",
    }).then((resp) => {
      expect(resp.status).to.eq(200)
    })
  })

  //YIELDS CORRECT RESPONSE
  it("Correct return values with correct data", () => {
    let array = []
    
    //fill array with random numbers
    for (var i = 0; i < 10; i++) {
      array.push(Math.floor(Math.random() * 1000))
    }

    //check random numbers' response
    array.forEach(element => {

    cy.request({
    url: baseUrl + element + "?json",

    }).then((resp) => {

      let json = resp.body

      //if there's no fact for a number
      if (json.found == false) {
        expect(json.text).to.match(/number.|google/)
      }

      expect(json.number).to.eq(element)
      expect(json.text).to.include(element + " is ")
      expect(json.type).to.eq("trivia");
    })
    })
    
  })

  //STATUS 404 PAGE NOT FOUND
  it("Status 404 with incorrect data given", () => {
    cy.request({
      url: baseUrl + "negyvenketto?json",
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.eq(404)
      expect(resp.body).to.include("Cannot GET /negyvenketto").and.to.include("Error")
    })

  })

  //STATUS 400, WRONG SYNTAX
  it("Status 400 with wrong syntax", () => {
    cy.request({
      url: baseUrl + "4.2?json",
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.eq(400)
      expect(resp.body).to.include("Invalid url")
    })
  })

})