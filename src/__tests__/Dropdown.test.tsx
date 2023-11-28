import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DropdownMenu from '../renderer/components/atoms/DropdownMenu';
import '@testing-library/jest-dom/extend-expect';


describe('DropdownMenu', () => {
  const commands = [
    { title: 'Command 1', onClick: jest.fn() },
    { title: 'Command 2', onClick: jest.fn() },
  ];

  it('should render the button and commands', () => {
    render(<DropdownMenu commands={commands} />);

    expect(screen.getByTestId('dropdown-button')).toBeInTheDocument();

  });

  it('should open the menu when the button is clicked', () => {
    render(<DropdownMenu commands={commands} />);

    const button = screen.getByTestId('dropdown-button');

    expect(screen.queryByRole('menu')).toBeNull();

    fireEvent.click(button);

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('should call the onClick function when a command is clicked', () => {
    render(<DropdownMenu commands={commands} />);

    const button = screen.getByTestId('dropdown-button');

    fireEvent.click(button);

    const menuItem = screen.getByText('Command 1', { selector: 'li' });

    fireEvent.click(menuItem);

    expect(commands[0].onClick).toHaveBeenCalled();
  });

  it('should close the menu after clicking a command', () => {
    render(<DropdownMenu commands={commands} />);

    const button = screen.getByTestId('dropdown-button');
    fireEvent.click(button);

    const menuItem = screen.getByText('Command 1', { selector: 'li' });

    fireEvent.click(menuItem);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
