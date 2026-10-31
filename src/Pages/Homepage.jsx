import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "./axiosclient";
import { logoutUser } from "./authSlice";

function HomePage() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);

  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  // Fetch all problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get(
          "/problem/getAllProblem"
        );

        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, []);

  // Fetch solved problems
  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get(
          "/problem/problemSolvedByUser"
        );

        setSolvedProblems(data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    if (user) {
      fetchSolvedProblems();
    }
  }, [user]);

  // Logout
  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  // Filter problems
  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" ||
      problem.difficulty === filters.difficulty;

    const tagMatch =
      filters.tag === "all" ||
      problem.tags?.includes(filters.tag);

    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" &&
        solvedProblems.some(
          (sp) => sp._id === problem._id
        )) ||
      (filters.status === "unsolved" &&
        !solvedProblems.some(
          (sp) => sp._id === problem._id
        ));

    return difficultyMatch && tagMatch && statusMatch;
  });

  // Get all unique tags
  const allTags = [
    ...new Set(
      problems.flatMap((problem) => problem.tags || [])
    ),
  ];

  return (
    <div className="min-h-screen bg-base-200">

      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-md px-6">
        
        <div className="flex-1">
          <NavLink
            to="/"
            className="text-2xl font-bold text-primary"
          >
            CodeArena
          </NavLink>
        </div>

        <div className="flex-none gap-4">

          {user && (
            <div className="hidden sm:block text-right">
              <p className="font-semibold">
                {user.firstName}
              </p>

              <p className="text-sm text-base-content/60">
                {user.emailid}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="btn btn-error btn-sm text-white"
          >
            Logout
          </button>

        </div>
      </div>


      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Problems
          </h1>

          <p className="text-base-content/60 mt-1">
            Solve coding problems and improve your skills.
          </p>
        </div>


        {/* Filters */}
        <div className="bg-base-100 rounded-xl shadow-md p-5 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Difficulty */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Difficulty
                </span>
              </label>

              <select
                className="select select-bordered w-full"
                value={filters.difficulty}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    difficulty: e.target.value,
                  })
                }
              >
                <option value="all">
                  All Difficulties
                </option>

                <option value="easy">
                  Easy
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="hard">
                  Hard
                </option>
              </select>
            </div>


            {/* Tag */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Topic
                </span>
              </label>

              <select
                className="select select-bordered w-full"
                value={filters.tag}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    tag: e.target.value,
                  })
                }
              >
                <option value="all">
                  All Topics
                </option>

                {allTags.map((tag) => (
                  <option
                    key={tag}
                    value={tag}
                  >
                    {tag}
                  </option>
                ))}
              </select>
            </div>


            {/* Status */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Status
                </span>
              </label>

              <select
                className="select select-bordered w-full"
                value={filters.status}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value,
                  })
                }
              >
                <option value="all">
                  All Problems
                </option>

                <option value="solved">
                  Solved
                </option>

                <option value="unsolved">
                  Unsolved
                </option>
              </select>
            </div>

          </div>

        </div>


        {/* Problem count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-base-content/60">
            Showing{" "}
            <span className="font-semibold">
              {filteredProblems.length}
            </span>{" "}
            problems
          </p>
        </div>


        {/* Problems */}
        <div className="space-y-3">

          {filteredProblems.map((problem, index) => {

            const isSolved = solvedProblems.some(
              (sp) => sp._id === problem._id
            );

            return (
              <NavLink
                key={problem._id}
                to={`/problem/${problem._id}`}
                className="block"
              >
                <div className="card bg-base-100 shadow-sm hover:shadow-lg transition-shadow">

                  <div className="card-body p-5">

                    <div className="flex items-center justify-between gap-4">

                      {/* Left */}
                      <div className="flex items-center gap-4">

                        {/* Number */}
                        <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>

                        <div>

                          <h2 className="font-semibold text-lg">
                            {problem.title}
                          </h2>

                          <div className="flex flex-wrap gap-2 mt-2">

                            {/* Difficulty */}
                            <span
                              className={`badge ${
                                problem.difficulty === "easy"
                                  ? "badge-success"
                                  : problem.difficulty === "medium"
                                  ? "badge-warning"
                                  : "badge-error"
                              }`}
                            >
                              {problem.difficulty}
                            </span>

                            {/* Tags */}
                            {problem.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="badge badge-outline"
                              >
                                {tag}
                              </span>
                            ))}

                          </div>

                        </div>

                      </div>


                      {/* Right */}
                      <div>

                        {isSolved ? (
                          <span className="badge badge-success gap-1">
                            ✓ Solved
                          </span>
                        ) : (
                          <span className="badge badge-ghost">
                            Unsolved
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              </NavLink>
            );
          })}

        </div>


        {/* No problems */}
        {filteredProblems.length === 0 && (
          <div className="text-center py-16">

            <div className="text-5xl mb-4">
              🔍
            </div>

            <h2 className="text-xl font-semibold">
              No problems found
            </h2>

            <p className="text-base-content/60 mt-2">
              Try changing your filters.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default HomePage;