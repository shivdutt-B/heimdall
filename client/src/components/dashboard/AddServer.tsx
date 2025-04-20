import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../Helper/Auth";
import { useRecoilValue } from "recoil";
import { authState } from "../../store/auth";

const AddServer = () => {
  const auth = useRecoilValue(authState);

  const [serverForm, setServerForm] = React.useState({
    name: "",
    url: "",
  });

  const handleAddServer = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add server logic here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#040506] text-white/80">
      <div className="w-full max-w-[400px] px-4">
        <div className="w-full">
          {auth.error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-sm text-sm">
              {auth.error}
            </div>
          )}

          <div className="animate-fadeIn">
            <form onSubmit={handleAddServer}>
              <div className="bg-transparent p-6 border border-gray-700 shadow-lg rounded-sm min-h-[400px]">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Add Server
                  </h2>
                  <p className="text-sm text-white/60">
                    Enter your server details to add a new server
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Server Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={serverForm.name}
                      onChange={(e) =>
                        setServerForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full p-2 bg-transparent border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500"
                      placeholder="My Server"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="url" className="text-sm font-medium">
                      Server URL
                    </label>
                    <input
                      id="url"
                      type="url"
                      value={serverForm.url}
                      onChange={(e) =>
                        setServerForm((prev) => ({
                          ...prev,
                          url: e.target.value,
                        }))
                      }
                      className="w-full p-2 bg-transparent border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500"
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={auth.loading}
                    className="w-full bg-white text-black font-medium py-2 rounded-sm hover:bg-white/90 transition-colors transform hover:scale-[1.02] duration-200 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {auth.loading ? "Adding Server..." : "Add Server"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServer;
