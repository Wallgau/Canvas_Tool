import type { Story } from '@ladle/react';
import { Card } from './Card';
import Button from '../Button/Button';
import Input from '../Input/Input';
import '../../../index.css';


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
            className="w-full" value={''} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
              throw new Error('Function not implemented.');
            } }          />
        </div>
        <div className="flex gap-2">
          <Button
            description="Saved"
            variant="primary"
            onClick={() => console.log('Saved')}
          />
          <Button
            className="bg-gray-400"
            description="Cancel"
            variant="outline"
            onClick={() => console.log('Cancelled')}
          />
        </div>
      </div>
    }
  />
);

export const SearchCard: Story = () => (
  <Card
    id="search-card"
    title="Wikipedia Search"
    description="Find and select tools for your project"
    content={
      <div className="space-y-4">
        <div>
          <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
            Query
          </label>
          <Input
            id="query"
            placeholder="React"
            className="w-full" value={''} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
              throw new Error('Function not implemented.');
            } }          />
        </div>
        <div>
          <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <Input
            id="language"
            placeholder="en"
            className="w-full" value={''} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
              throw new Error('Function not implemented.');
            } }          />
        </div>
        <div className="flex gap-2">
          <Button
            description="Save"
            variant="primary"
            onClick={() => console.log('Saved')}
          />
          <Button
            className="bg-gray-400"
            description="Cancel"
            variant="outline"
            onClick={() => console.log('Cancelled')}
          />
        </div>
      </div>
    }
  />
);

