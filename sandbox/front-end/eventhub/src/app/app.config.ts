import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
   LucideArrowRight,
   LucideBuilding2,
   LucideChevronDown,
   LucideChevronLeft,
   LucideChevronRight,
   LucideCircleCheckBig,
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
      provideRouter(routes),
      provideLucideIcons(
         LucideArrowRight,
         LucideBuilding2,
         LucideChevronDown,
         LucideChevronLeft,
         LucideChevronRight,
         LucideCircleCheckBig,
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
         LucideSun,
         LucideTicket,
         LucideUserRound,
         LucideUsers,
         LucideX
      )
   ]
};
