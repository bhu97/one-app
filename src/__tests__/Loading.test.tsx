import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingDialog from '../renderer/components/atoms/Loading';
import '@testing-library/jest-dom/extend-expect';

describe('LoadingDialog', () => {
  it('should render LoadingDialog with default message', () => {
    const { getByText } = render(<LoadingDialog open={true} />);

    expect(getByText('Loading')).toBeInTheDocument();
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('should render LoadingDialog with a custom message', () => {
    const customMessage = 'Custom Loading Message';
    const { getByText } = render(<LoadingDialog open={true} message={customMessage} />);

    expect(getByText(customMessage)).toBeInTheDocument();
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('should not render LoadingDialog when open is false', () => {
    const { queryByText } = render(<LoadingDialog open={false} />);

    expect(queryByText('Loading')).toBeNull();
    expect(queryByText('Please wait...')).toBeNull();
  });
});
