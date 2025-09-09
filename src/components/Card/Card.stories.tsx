import type { Story } from '@ladle/react';
import { Card } from './Card';
import Button from '../Button/Button';
import Input from '../Input/Input';
import '../../index.css';


export const WeatherForecast: Story = () => (
  <Card
    id="weather-card"
    title="Weather Forecast"
    description="Check the weather for your location"
    content={
      <div className="space-y-4">
        <div>
          <label htmlFor="city-input" className="block text-sm font-medium text-gray-700 mb-2">
            Enter city name
          </label>
          <Input
            id="city-input"
            placeholder="e.g., New York, London, Tokyo"
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            description="Get Weather"
            variant="primary"
            onClick={() => console.log('Getting weather...')}
          />
          <Button
            description="Clear"
            variant="outline"
            onClick={() => console.log('Clearing...')}
          />
        </div>
      </div>
    }
  />
);

export const SearchCard: Story = () => (
  <Card
    id="search-card"
    title="Search Tools"
    description="Find and select tools for your project"
    content={
      <div className="space-y-4">
        <div>
          <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
            Search for tools
          </label>
          <Input
            id="search-input"
            placeholder="Type to search..."
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            description="Search"
            variant="primary"
            onClick={() => console.log('Searching...')}
          />
          <Button
            description="Reset"
            variant="outline"
            onClick={() => console.log('Resetting...')}
          />
        </div>
      </div>
    }
  />
);

export const SettingsCard: Story = () => (
  <Card
    id="settings-card"
    title="Settings"
    description="Configure your application preferences"
    content={
      <div className="space-y-4">
        <div>
          <label htmlFor="username-input" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <Input
            id="username-input"
            placeholder="Enter your username"
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            description="Save"
            variant="primary"
            onClick={() => console.log('Saving...')}
          />
          <Button
            description="Cancel"
            variant="outline"
            onClick={() => console.log('Canceling...')}
          />
        </div>
      </div>
    }
  />
);

export const WithDelete: Story = () => (
  <Card
    id="delete-card"
    title="Remove Item"
    description="This card can be deleted"
    content={
      <div className="space-y-4">
        <p className="text-gray-600">This card demonstrates the delete functionality.</p>
        <div className="flex gap-2">
          <Button
            description="Action"
            variant="primary"
            onClick={() => console.log('Action clicked')}
          />
        </div>
      </div>
    }
    onDelete={(id) => console.log('Delete card:', id)}
  />
);

export const Empty: Story = () => (
  <Card
    id="empty-card"
    title="Empty Card"
    description="A simple card with no content"
    content={null}
  />
);