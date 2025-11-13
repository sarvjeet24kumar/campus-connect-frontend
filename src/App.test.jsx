import { render, screen } from '@testing-library/react'
import App from './App'

describe('App component', () => {
  it('renders heading', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Vite + React')
  })
})
