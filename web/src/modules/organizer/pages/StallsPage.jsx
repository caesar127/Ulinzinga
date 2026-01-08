import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setSelectedStall,
  clearStalls,
} from "@/features/stalls/stallsSlice";
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useGetOrganizerStallsQuery } from "@/features/stalls/stallsApiSlice";
import CreateStallModal from "../components/CreateStallModal";

function StallsPage() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStalls, setFilteredStalls] = useState([]);

  const [openMenu, setOpenMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  const {
    data: stallsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrganizerStallsQuery({
    page: currentPage,
    limit: pageLimit,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const stalls = stallsData?.stalls || [];

  useEffect(() => {
    if (stalls?.length > 0) {
      const term = searchTerm.toLowerCase();

      const filtered = stalls.filter(
        (stall) =>
          stall.name?.toLowerCase().includes(term) ||
          stall.type?.toLowerCase().includes(term) ||
          stall.size?.toLowerCase().includes(term) ||
          String(stall.price).includes(term)
      );

      setFilteredStalls(filtered);
    } else {
      setFilteredStalls([]);
    }
  }, [stalls, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit) => {
    setPageLimit(newLimit);
    setCurrentPage(1);
  };

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  const paginatedStalls = filteredStalls;
  const pagination = stallsData?.pagination;

  const handleCreateStall = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="h-full bg-[#F7F8F9] p-6">
      <div className="max-w-full mx-auto">
        <div className="mb-3">
          <h1 className="text-xl font-[600]">My Stalls</h1>
          <p className="mt-1 text-sm text-[#7B7B7B]">
            Create and manage your stalls
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
            <input
              type="text"
              placeholder="Search stalls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 px-4 py-2 border border-black/10 rounded-lg focus:outline-none"
            />

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                Filter by type
              </button>

              <button
                onClick={handleCreateStall}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                New Stall
              </button>
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A]">Name</th>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A]">Type</th>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A]">Size</th>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A]">Price</th>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A] text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedStalls.map((stall, idx) => (
                <tr key={stall.id || idx} className="hover:bg-gray-50">
                  <td className="px-2 py-1 text-sm font-medium">{stall.name}</td>
                  <td className="px-2 py-1 text-sm">{stall.type}</td>
                  <td className="px-2 py-1 text-sm capitalize">{stall.size}</td>
                  <td className="px-2 py-1 text-sm">${stall.price}</td>

                  <td className="px-2 py-1 text-right relative">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        {stall.isVisible ? (
                          <EyeIcon className="h-5 w-5 text-gray-700" />
                        ) : (
                          <EyeSlashIcon className="h-5 w-5 text-gray-700" />
                        )}
                      </button>

                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        {stall.isActive ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500" />
                        )}
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => toggleMenu(idx)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <EllipsisVerticalIcon className="h-5 w-5 text-gray-700" />
                        </button>

                        {openMenu === idx && (
                          <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border z-50">
                            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                              <PencilIcon className="h-4 w-4" />
                              Edit
                            </button>

                            <button
                              onClick={() => dispatch(setSelectedStall(stall))}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              <EyeIcon className="h-4 w-4" />
                              View
                            </button>

                            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                              <TrashIcon className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedStalls.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 text-sm">
                    {isLoading ? "Loading stalls..." : "No stalls found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing{" "}
                {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)}{" "}
                of {pagination.totalCount} results
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={pageLimit}
                  onChange={(e) => handleLimitChange(e.target.value)}
                  className="px-3 py-1 text-sm border rounded-lg"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateStallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default StallsPage;
