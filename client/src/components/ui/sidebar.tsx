// import React, { createContext, useContext, useState } from "react";

// // Sidebar context
// interface SidebarContextProps {
//   isOpen: boolean;
//   setIsOpen: (value: boolean) => void;
// }

// const SidebarContext = createContext<SidebarContextProps | undefined>(
//   undefined
// );

// // Provider component
// interface SidebarProviderProps {
//   defaultOpen?: boolean;
//   children: React.ReactNode;
// }

// export const SidebarProvider: React.FC<SidebarProviderProps> = ({
//   defaultOpen = false,
//   children,
// }) => {
//   const [isOpen, setIsOpen] = useState(defaultOpen);

//   return (
//     <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
//       {children}
//     </SidebarContext.Provider>
//   );
// };

// // Sidebar component
// interface SidebarProps {
//   children: React.ReactNode;
//   className?: string;
// }

// export const Sidebar: React.FC<SidebarProps> = ({
//   children,
//   className = "",
// }) => {
//   const context = useContext(SidebarContext);

//   if (!context) {
//     throw new Error("Sidebar must be used within SidebarProvider");
//   }

//   const { isOpen } = context;

//   return (
//     <aside
//       className={`shrink-0 border-r bg-background/95 backdrop-blur ${
//         isOpen ? "w-64" : "w-0 md:w-64"
//       } transition-all duration-300 md:flex md:flex-col ${className}`}
//     >
//       <div className="flex h-full flex-col">{children}</div>
//     </aside>
//   );
// };

// // Sidebar header
// export const SidebarHeader: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   return <div className="border-b px-4 py-2">{children}</div>;
// };

// // Sidebar content
// export const SidebarContent: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   return <div className="flex-1 overflow-auto py-2">{children}</div>;
// };

// // Sidebar footer
// export const SidebarFooter: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   return <div className="border-t">{children}</div>;
// };

// // Sidebar group
// export const SidebarGroup: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   return <div className="px-3 py-2">{children}</div>;
// };

// // Sidebar group label
// export const SidebarGroupLabel: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   return (
//     <h3 className="mb-2 text-xs font-medium text-muted-foreground">
//       {children}
//     </h3>
//   );
// };

// // Sidebar group content
// export const SidebarGroupContent: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   return <div className="space-y-1">{children}</div>;
// };

// // Sidebar menu
// export const SidebarMenu: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   return <nav className="grid gap-1">{children}</nav>;
// };

// // Sidebar menu item
// export const SidebarMenuItem: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   return <div>{children}</div>;
// };

// // Sidebar menu button
// interface SidebarMenuButtonProps {
//   children: React.ReactNode;
//   isActive?: boolean;
//   onClick?: () => void;
// }

// export const SidebarMenuButton: React.FC<SidebarMenuButtonProps> = ({
//   children,
//   isActive = false,
//   onClick,
// }) => {
//   return (
//     <button
//       className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm ${
//         isActive
//           ? "bg-accent text-accent-foreground"
//           : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
//       }`}
//       onClick={onClick}
//     >
//       {children}
//     </button>
//   );
// };

// // Sidebar trigger (mobile)
// interface SidebarTriggerProps {
//   className?: string;
// }

// export const SidebarTrigger: React.FC<SidebarTriggerProps> = ({
//   className = "",
// }) => {
//   const context = useContext(SidebarContext);

//   if (!context) {
//     throw new Error("SidebarTrigger must be used within SidebarProvider");
//   }

//   const { isOpen, setIsOpen } = context;

//   return (
//     <button
//       className={`rounded-md border p-2 ${className}`}
//       onClick={() => setIsOpen(!isOpen)}
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <line x1="3" y1="12" x2="21" y2="12" />
//         <line x1="3" y1="6" x2="21" y2="6" />
//         <line x1="3" y1="18" x2="21" y2="18" />
//       </svg>
//       <span className="sr-only">Toggle sidebar</span>
//     </button>
//   );
// };
