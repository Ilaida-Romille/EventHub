import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
   LucideArrowUpDown,
   LucideArrowRight,
   LucideBadgeCheck,
   LucideBuilding2,
   LucideCalendarFold,
   LucideChevronDown,
   LucideChevronLeft,
   LucideChevronRight,
   LucideCircleCheckBig,
   LucideContactRound,
   LucideLayoutDashboard,
   LucideLogOut,
   LucideMenu,
   LucideMessagesSquare,
   LucideMoon,
   LucidePaperclip,
   LucidePanelLeftClose,
   LucidePanelLeftOpen,
   LucideReceiptText,
   LucideSendHorizontal,
   LucideSettings,
   LucideSun,
   LucideTicket,
   LucideUserRound,
   LucideUsers,
   LucideX,
   provideLucideIcons
} from '@lucide/angular';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
   providers: [
      provideBrowserGlobalErrorListeners(),
      provideHttpClient(),
      provideRouter(routes),
      provideLucideIcons(
         LucideArrowUpDown,
         LucideArrowRight,
         LucideBadgeCheck,
         LucideBuilding2,
         LucideCalendarFold,
         LucideChevronDown,
         LucideChevronLeft,
         LucideChevronRight,
         LucideCircleCheckBig,
         LucideContactRound,
         LucideLayoutDashboard,
         LucideLogOut,
         LucideMenu,
         LucideMessagesSquare,
         LucideMoon,
         LucidePaperclip,
         LucidePanelLeftClose,
         LucidePanelLeftOpen,
         LucideReceiptText,
         LucideSendHorizontal,
         LucideSettings,
         LucideSun,
         LucideTicket,
         LucideUserRound,
         LucideUsers,
         LucideX
      )
   ]
};
