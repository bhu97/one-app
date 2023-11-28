import React from 'react';
import { render, screen } from '@testing-library/react';
import SettingsPage from '../renderer/components/pages/Settings';

describe('SettingsPage', () => {
  it('should render the SettingsPage with header and content', () => {
    render(<SettingsPage />);

    expect(screen.getByText('Settings')).toBeInTheDocument();

    expect(
      screen.getByText('One App settings and contact information')
    ).toBeInTheDocument();

    const headerImage = screen.getByAltText('Settings Header Image');
    expect(headerImage).toBeInTheDocument();
    expect(headerImage.getAttribute('src')).toMatch(/201015_FMC/);

    expect(screen.getByTestId('app-settings')).toBeInTheDocument();

    expect(screen.getByTestId('contacts')).toBeInTheDocument();
  });
});
