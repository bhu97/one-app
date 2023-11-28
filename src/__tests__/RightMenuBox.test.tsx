import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import RightMenuBox from '../renderer/components/atoms/RightMenuBox';

describe('RightMenuBox', () => {
  it('should render the title and children', () => {
    const title = 'Sample Title';
    render(<RightMenuBox title={title}>Sample Content</RightMenuBox>);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText('Sample Content')).toBeInTheDocument();
  });

  it('should call onPlusClick when the plus button is clicked', () => {
    const title = 'Sample Title';
    const onPlusClick = jest.fn();
    render(<RightMenuBox title={title} onPlusClick={onPlusClick}>Sample Content</RightMenuBox>);

    const plusButton = screen.getByTestId('plus-button');
    fireEvent.click(plusButton);

    expect(onPlusClick).toHaveBeenCalled();
  });

  it('should not render the plus button when onPlusClick is not provided', () => {
    const title = 'Sample Title';
    render(<RightMenuBox title={title}>Sample Content</RightMenuBox>);

    expect(screen.queryByRole('button', { name: 'Plus Icon' })).toBeNull();
  });
});
