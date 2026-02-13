import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ApiList } from '../components/ApiList';
import { RequestBuilder } from '../components/RequestBuilder';
import { VisualizationToggle } from '../components/VisualizationToggle';

describe('frontend critical components', () => {
  it('filters API list by keyword', async () => {
    const user = userEvent.setup();
    render(
      <ApiList
        apis={[
          {
            id: 'weather',
            name: 'Weather API',
            category: 'utility',
            endpoint: 'https://example.com/weather'
          },
          {
            id: 'news',
            name: 'News API',
            category: 'content',
            endpoint: 'https://example.com/news'
          }
        ]}
      />
    );

    await user.type(screen.getByLabelText('Filter APIs'), 'weath');

    expect(screen.getByText('Weather API')).toBeInTheDocument();
    expect(screen.queryByText('News API')).not.toBeInTheDocument();
  });

  it('updates request builder preview', async () => {
    const user = userEvent.setup();
    render(<RequestBuilder />);

    await user.selectOptions(screen.getByLabelText('Method'), 'POST');
    await user.clear(screen.getByLabelText('Path'));
    await user.type(screen.getByLabelText('Path'), '/health');

    expect(screen.getByLabelText('request-preview')).toHaveTextContent('POST /health');
  });

  it('switches visualization mode', async () => {
    const user = userEvent.setup();
    render(<VisualizationToggle />);

    await user.click(screen.getByRole('button', { name: 'Table' }));

    expect(screen.getByLabelText('visualization-mode')).toHaveTextContent('table');
  });
});
