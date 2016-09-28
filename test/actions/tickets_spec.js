import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from 'actions'
import * as types from 'constants/actionTypes'
import nock from 'nock'
import { expect } from 'chai'

import {
  FETCH_TICKETS_SUCCESS,
  FETCH_TICKETS_FAILURE,
  FETCH_TICKETS_REQUEST,
} from 'constants/actionTypes'

import {
  fetchTicketsRequest,
  fetchTicketsFailure,
  fetchTicketsSuccess,
} from 'actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const URL = 'http://localhost:8080/api/v1'

describe('Ticket Actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('fetchTicketsRequest', () => {
    it('should return the correct type', () => {
      const expectedResult = {
        type: FETCH_TICKETS_REQUEST,
      }

      expect(fetchTicketsRequest()).to.deep.eq(expectedResult)
    })
  })

  describe('fetchTicketsSuccess', () => {
    it('should return the correct type and the correct response', () => {
      const fixture = [{
        id: 1,
        description: 'Ticket description',
        summary: 'Ticket summary',
      }]
      const expectedResult = {
        type: FETCH_TICKETS_SUCCESS,
        response: {
          result: [1],
          entities: {
            tickets: {
              1: fixture[0]
            }
          }
        }
      }

      expect(fetchTicketsSuccess(fixture)).to.deep.eq(expectedResult)
    })
  })

  describe('fetchTicketsFailure', () => {
    it('should return the correct type and the error', () => {
      const fixture = {
        message: 'Error!'
      }
      const expectedResult = {
        type: FETCH_TICKETS_FAILURE,
        message: fixture.message
      }

      expect(fetchTicketsFailure(fixture)).to.deep.eq(expectedResult)
    })
  })

  describe('fetchTickets', () => {
    it('creates FETCH_TICKETS_SUCCESS when fetching tickets is finished', () => {
      nock(URL)
        .get('/tickets')
        .reply(200, { body: [{
          id: 1,
          description: 'Ticket description',
          summary: 'Ticket summary'
        }]})

      const expectedActions = [
        { type: types.FETCH_TICKETS_REQUEST },
        { type: types.FETCH_TICKETS_SUCCESS, response: {
          entities: {
            tickets: {
              1: {
                id: 1,
                description: "Ticket description",
                summary: "Ticket summary"
              }
            }
          },
          result: [1]
        }}
      ]
      const store = mockStore({ tickets: [] })

      store.dispatch(actions.fetchTickets())
        .then(() => {
          expect(store.getActions()).to.eq(expectedActions)
        })
    })
  })
})
