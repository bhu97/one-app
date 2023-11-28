import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SimpleModal from '../renderer/components/atoms/SimpleModal';

describe('SimpleModal', () => {
  it('should render the modal when open is true', () => {
    const items = [{ name: 'Item 1', length: 1 }];
    const setClose = jest.fn();
    const open = true;
    render(
      <SimpleModal items={items} setClose={setClose} open={open} />
    );

    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByText('Subject')).toBeInTheDocument();
    expect(screen.getByText('Attachments')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('should not render the modal when open is false', () => {
    const items = [{ name: 'Item 1', length: 1 }];
    const setClose = jest.fn();
    const open = false;
    render(
      <SimpleModal items={items} setClose={setClose} open={open} />
    );

    expect(screen.queryByText('To')).toBeNull();
    expect(screen.queryByText('Subject')).toBeNull();
    expect(screen.queryByText('Attachments')).toBeNull();
    expect(screen.queryByText('Send')).toBeNull();
  });

  it('should trigger the close function when the close button is clicked', () => {
    const items = [{ name: 'Item 1', length: 1 }];
    const setClose = jest.fn();
    const open = true;
    render(
      <SimpleModal items={items} setClose={setClose} open={open} />
    );

    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    expect(setClose).toHaveBeenCalled();
  });
});
