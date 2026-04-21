import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import TripForm from './TripForm'
import userReducer from '../reducers/userReducer'

const addNewTripMock = vi.fn(() => async () => { })
const navigateMock = vi.fn()

vi.mock('../reducers/tripReducer', () => ({
  addNewTrip: (...args) => addNewTripMock(...args)
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock
  }
})

const renderForm = () => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: { id: '1' } }
  })

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <TripForm />
      </MemoryRouter>
    </Provider>
  )
}

beforeEach(() => {
  addNewTripMock.mockClear()
  navigateMock.mockClear()
})

test('does not submit if title is empty', async () => {
  const user = userEvent.setup()
  renderForm()

  const button = screen.getByText('Create')
  await user.click(button)

  expect(addNewTripMock).not.toHaveBeenCalled()
})

test('does not submit if title is too long', async () => {
  const user = userEvent.setup()
  renderForm()

  const input = screen.getByRole('textbox')
  const button = screen.getByText('Create')

  await user.type(input, 'This is a very very very very long title')
  await user.click(button)

  expect(addNewTripMock).not.toHaveBeenCalled()
})

test('submits with valid title', async () => {
  const user = userEvent.setup()
  renderForm()

  const input = screen.getByRole('textbox')
  const button = screen.getByText('Create')

  await user.type(input, 'New Trip')
  await user.click(button)

  expect(addNewTripMock).toHaveBeenCalledTimes(1)
  expect(addNewTripMock).toHaveBeenCalledWith({
    title: 'New Trip',
    userId: '1'
  })
})

test('renders correct elements', () => {
  renderForm()
  let element = screen.getByText('Title')
  expect(element).toBeDefined()
  element = screen.getByText('Create')
  expect(element).toBeDefined()
  element = screen.getByText('Cancel')
  expect(element).toBeDefined()
})

test('clicking cancel navigates to home', async () => {
  const user = userEvent.setup()
  renderForm()

  const cancelButton = screen.getByText('Cancel')
  await user.click(cancelButton)

  expect(navigateMock).toHaveBeenCalledWith('/')
})