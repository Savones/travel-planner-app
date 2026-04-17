import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import Trip from './Trip'
import tripReducer from '../reducers/tripReducer'
import userReducer from '../reducers/userReducer'
import { expect } from 'vitest'

const renderTrip = ({ route = '/trips/1', trip = {}, user = { id: '1' } } = {}) => {
  const defaultTrip = {
    id: '1',
    title: 'Default trip',
    user: { id: '1' },
    users: [],
    locations: [],
    ...trip
  }

  const store = configureStore({
    reducer: {
      trips: tripReducer,
      user: userReducer
    },
    preloadedState: {
      trips: [defaultTrip],
      user
    }
  })

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/trips/:id" element={<Trip />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

test('renders trip title', () => {
  renderTrip({
    route: '/trips/123',
    trip: {
      id: '123',
      title: 'Uusi matka'
    }
  })

  const element = screen.getByText('Uusi matka')
  expect(element).toBeDefined()
})

test('renders locations', () => {
  renderTrip({
    route: '/trips/123',
    trip: {
      id: '123',
      title: 'Trip',
      locations: [
        { id: '1', city: 'Helsinki', country: 'Finland' }
      ]
    }
  })

  const element = screen.getByText('Helsinki, Finland')
  expect(element).toBeDefined()
})

test('renders location details', () => {
  renderTrip({
    route: '/trips/123',
    trip: {
      id: '123',
      title: 'Trip',
      locations: [
        {
          id: '1',
          city: 'Helsinki',
          country: 'Finland',
          startDate: '2026-04-15T00:00:00.000Z',
          endDate: '2026-04-18T00:00:00.000Z',
          notes: 'This is a note.',
          accommodation: 'Hotel Palace'
        }
      ]
    }
  })

  let element = screen.getByText('Helsinki, Finland')
  expect(element).toBeDefined()
  element = screen.getByText('15.4.2026 – 18.4.2026')
  expect(element).toBeDefined()
  element = screen.getByText('This is a note.')
  expect(element).toBeDefined()
  element = screen.getByText('Hotel Palace')
  expect(element).toBeDefined()
})

test('owner sees edit and delete button', () => {
  renderTrip({
    route: '/trips/123',
    trip: {
      id: '123',
      user: { id: '1' }
    },
    user: { id: '1' }
  })

  const element = screen.getByText('Edit')
  const element2 = screen.getByText('Delete')
  expect(element).toBeDefined()
  expect(element2).toBeDefined()
})

test('editor sees edit button but not delete button', () => {
  renderTrip({
    route: '/trips/123',
    trip: {
      id: '123',
      user: { id: '1' },
      users: [
        { user: { id: '2' }, role: 'editor' }
      ]
    },
    user: { id: '2' }
  })

  const element = screen.getByText('Edit')
  const element2 = screen.queryByText('Delete')
  expect(element).toBeDefined()
  expect(element2).toBeNull()
})

test('reader does neither see edit nor delete button', () => {
  renderTrip({
    route: '/trips/123',
    trip: {
      id: '123',
      user: { id: '1' },
      users: [
        { user: { id: '2' }, role: 'reader' }
      ]
    },
    user: { id: '2' }
  })

  const element = screen.queryByText('Edit')
  const element2 = screen.queryByText('Delete')
  expect(element).toBeNull()
  expect(element2).toBeNull()
})