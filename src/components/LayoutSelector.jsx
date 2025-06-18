import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Columns2, Rows3, Eye } from 'lucide-react';

const LayoutSelector = ({ layout, onLayoutChange, isDarkMode }) => {
  const layouts = [
    {
      id: 'side-by-side',
      name: 'Side by Side',
      icon: Columns2,
      description: 'Code and preview side by side',
    },
    {
      id: 'stacked',
      name: 'Stacked',
      icon: Rows3,
      description: 'Code above, preview below',
    },
    {
      id: 'preview-only',
      name: 'Preview Only',
      icon: Eye,
      description: 'Full screen preview',
    },
  ];

  const currentLayout = layouts.find((l) => l.id === layout);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`${
            isDarkMode
              ? 'text-gray-300 hover:text-white hover:bg-white/10'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          {currentLayout && <currentLayout.icon className="w-4 h-4 mr-2" />}
          Layout
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={`${
          isDarkMode
            ? 'bg-gray-900 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        {layouts.map((layoutOption) => {
          const Icon = layoutOption.icon;
          return (
            <DropdownMenuItem
              key={layoutOption.id}
              onClick={() => onLayoutChange(layoutOption.id)}
              className={`cursor-pointer ${
                isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800 focus:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
              } ${layout === layoutOption.id ? 'bg-opacity-50' : ''}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              <div className="flex flex-col">
                <span className="font-medium">{layoutOption.name}</span>
                <span
                  className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {layoutOption.description}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LayoutSelector;
