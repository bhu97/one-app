import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from '../renderer/components/organisms/Sidebar';
import '@testing-library/jest-dom/extend-expect';

describe('Sidebar', () => {
  it('should render the Sidebar with logo and navigation', () => {
    render(<Sidebar navigationEnabled />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();

    expect(screen.getByTestId('navigation')).toBeInTheDocument();

    const drawer = screen.getByRole('presentation');
    expect(drawer).toHaveClass('MuiDrawer-root');

    const drawerPaper = screen.getByRole('complementary');
    expect(drawerPaper).toHaveClass('MuiDrawer-paper');
  });

  it('should hide navigation when navigationEnabled is false', () => {
    render(<Sidebar navigationEnabled={false} />);
    expect(screen.queryByTestId('navigation')).toBeNull();
  });
});
