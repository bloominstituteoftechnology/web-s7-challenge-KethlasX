import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Unit tests for sum function
describe('sum function', () => {
  test('throws an error if no arguments are passed', () => {
    expect(() => sum()).toThrow('pass valid numbers');
  });

  test('throws an error if any argument is not a valid number', () => {
    expect(() => sum(2, 'seven')).toThrow('pass valid numbers');
  });

  test('returns 4 when passed 1 and 3', () => {
    expect(sum(1, 3)).toBe(4);
  });

  test('returns 3 when passed "1" and 2', () => {
    expect(sum('1', 2)).toBe(3);
  });

  test('returns 13 when passed "10" and "3"', () => {
    expect(sum('10', '3')).toBe(13);
  });
});

// Integration tests for HelloWorld component
describe('<HelloWorld /> component', () => {
  beforeEach(() => {
    render(<HelloWorld />);
  });

  test('renders a link that reads "Home"', () => {
    expect(screen.queryByText('Home')).toBeInTheDocument();
  });

  test('renders a link that reads "About"', () => {
    expect(screen.queryByText('About')).toBeInTheDocument();
  });

  test('renders a link that reads "Blog"', () => {
    expect(screen.queryByText('Blog')).toBeInTheDocument();
  });

  test('renders a text that reads "The Truth"', () => {
    expect(screen.queryByText('The Truth')).toBeInTheDocument();
  });

  test('renders a text that reads "JavaScript is pretty awesome"', () => {
    expect(screen.queryByText('JavaScript is pretty awesome')).toBeInTheDocument();
  });

  test('renders a text that includes "javaScript is pretty" (exact = false)', () => {
    expect(screen.queryByText('javaScript is pretty', { exact: false })).toBeInTheDocument();
  });
});

function sum(a, b) {
  a = Number(a)
  b = Number(b)
  if (isNaN(a) || isNaN(b)) {
    throw new Error('pass valid numbers')
  }
  return a + b
}

function HelloWorld() {
  return (
    <div>
      <h1>Hello World Component</h1>
      <nav>
        <a href='#'>Home</a>
        <a href='#'>About</a>
        <a href='#'>Blog</a>
      </nav>
      <main>
        <section>
          <h2>The Truth</h2>
          <p>JavaScript is pretty awesome</p>
        </section>
      </main>
    </div>
  )
}
