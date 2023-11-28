import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UpdateMetadataDialog from '../renderer/components/atoms/UpdateMetadataDialog';

describe('UpdateMetadataDialog', () => {
  it('should render the dialog when isOpen is true', () => {
    const isOpen = true;
    const onClose = jest.fn();
    const onUpdate = jest.fn();

    render(
      <UpdateMetadataDialog isOpen={isOpen} onClose={onClose} onUpdate={onUpdate} />
    );

    expect(screen.getByText('Updates available')).toBeInTheDocument();
    expect(screen.getByText('Would you like to update and download?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('should not render the dialog when isOpen is false', () => {
    const isOpen = false;
    const onClose = jest.fn();
    const onUpdate = jest.fn();

    render(
      <UpdateMetadataDialog isOpen={isOpen} onClose={onClose} onUpdate={onUpdate} />
    );

    expect(screen.queryByText('Updates available')).toBeNull();
    expect(screen.queryByText('Would you like to update and download?')).toBeNull();
    expect(screen.queryByText('Cancel')).toBeNull();
    expect(screen.queryByText('Update')).toBeNull();
  });

  it('should call onClose when the Cancel button is clicked', () => {
    const isOpen = true;
    const onClose = jest.fn();
    const onUpdate = jest.fn();

    render(
      <UpdateMetadataDialog isOpen={isOpen} onClose={onClose} onUpdate={onUpdate} />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onUpdate when the Update button is clicked', () => {
    const isOpen = true;
    const onClose = jest.fn();
    const onUpdate = jest.fn();

    render(
      <UpdateMetadataDialog isOpen={isOpen} onClose={onClose} onUpdate={onUpdate} />
    );

    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    expect(onUpdate).toHaveBeenCalled();
  });
});
