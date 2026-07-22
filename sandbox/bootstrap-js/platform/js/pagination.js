export const MOBILE_BREAKPOINT = 768;

export function isMobileViewport(width, breakpoint = MOBILE_BREAKPOINT) {
   return Number(width) < breakpoint;
}

export function getResponsiveItemsPerPage(
   width,
   config = { mobile: 4, desktop: 6 },
   breakpoint = MOBILE_BREAKPOINT
) {
   const safeConfig = {
      mobile: Math.max(1, Number(config.mobile ?? 4)),
      desktop: Math.max(1, Number(config.desktop ?? 6))
   };

   return isMobileViewport(width, breakpoint) ? safeConfig.mobile : safeConfig.desktop;
}

export function paginateItems(items, page, itemsPerPage) {
   const safeItems = Array.isArray(items) ? items : [];
   const safeItemsPerPage = Math.max(1, Number(itemsPerPage ?? 1));
   const totalPages = Math.max(1, Math.ceil(safeItems.length / safeItemsPerPage));
   const currentPage = Math.min(Math.max(1, Number(page ?? 1)), totalPages);
   const start = (currentPage - 1) * safeItemsPerPage;

   return {
      currentPage,
      totalPages,
      pageItems: safeItems.slice(start, start + safeItemsPerPage)
   };
}

export function shouldRecomputePageSize(previousWidth, nextWidth, breakpoint = MOBILE_BREAKPOINT) {
   return isMobileViewport(previousWidth, breakpoint) !== isMobileViewport(nextWidth, breakpoint);
}
