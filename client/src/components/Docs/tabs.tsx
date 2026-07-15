// import React, { createContext, useContext, useState } from "react";

// // Context to manage tab state
// interface TabsContextProps {
//   activeTab: string;
//   setActiveTab: (value: string) => void;
// }

// const TabsContext = createContext<TabsContextProps | undefined>(undefined);

// // Tabs container component
// interface TabsProps {
//   defaultValue: string;
//   children: React.ReactNode;
//   className?: string;
// }

// export const Tabs: React.FC<TabsProps> = ({
//   defaultValue,
//   children,
//   className = "",
// }) => {
//   const [activeTab, setActiveTab] = useState(defaultValue);

//   return (
//     <TabsContext.Provider value={{ activeTab, setActiveTab }}>
//       <div className={className}>{children}</div>
//     </TabsContext.Provider>
//   );
// };

// // Tab triggers container
// interface TabsListProps {
//   children: React.ReactNode;
//   className?: string;
// }

// export const TabsList: React.FC<TabsListProps> = ({
//   children,
//   className = "",
// }) => {
//   return <div className={`flex ${className}`}>{children}</div>;
// };

// // Tab trigger component
// interface TabsTriggerProps {
//   value: string;
//   children: React.ReactNode;
//   className?: string;
// }

// export const TabsTrigger: React.FC<TabsTriggerProps> = ({
//   value,
//   children,
//   className = "",
// }) => {
//   const context = useContext(TabsContext);

//   if (!context) {
//     throw new Error("TabsTrigger must be used within Tabs");
//   }

//   const { activeTab, setActiveTab } = context;
//   const isActive = activeTab === value;

//   return (
//     <button
//       className={`px-4 py-2 text-sm font-medium transition-all ${className}`}
//       onClick={() => setActiveTab(value)}
//       data-state={isActive ? "active" : "inactive"}
//     >
//       {children}
//     </button>
//   );
// };

// // Tab content component
// interface TabsContentProps {
//   value: string;
//   children: React.ReactNode;
//   className?: string;
// }

// export const TabsContent: React.FC<TabsContentProps> = ({
//   value,
//   children,
//   className = "",
// }) => {
//   const context = useContext(TabsContext);

//   if (!context) {
//     throw new Error("TabsContent must be used within Tabs");
//   }

//   const { activeTab } = context;

//   if (activeTab !== value) {
//     return null;
//   }

//   return <div className={className}>{children}</div>;
// };
