import { themeAlpine, AllCommunityModule, ModuleRegistry, provideGlobalGridOptions, ValidationModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);
provideGlobalGridOptions({ theme: "legacy"});

export const defaultTheme = themeAlpine;
