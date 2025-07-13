// "use client";

// import Image from "next/image";

// import { motion } from "motion/react";
// import { FiAward } from "react-icons/fi";
// import { RxAvatar } from "react-icons/rx";

// import Navbar from "@/app/_components/Navbar";
// import Beams from "@/app/_components/_background/Beams";
// import GradientGrid from "@/app/_components/_background/GradientGrid";

// import { UserType } from "@/types/types";

// export default function Leaderboard() {
//   return (
//     <main className="min-h-screen overflow-hidden bg-zinc-950">
//       <Navbar />
//       <Table />
//       <Beams />
//       <GradientGrid />
//     </main>
//   );
// }

// const Table = () => {
//   return (
//     <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-24 md:px-8 md:py-36">
//       <table className="w-full">
//         <thead>
//           <tr className="border-b-[1px] border-slate-200 text-slate-400 text-sm uppercase">
//             <th className="text-start p-4 font-medium">Student</th>
//             <th className="text-start p-4 font-medium">Rank</th>
//             <th className="text-start p-4 font-medium">Highest Rank</th>
//             <th className="text-start p-4 font-medium">Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.map((user, index) => {
//             const typedUser: UserType = {
//               ...user,
//               status: user.status as "online" | "offline",
//             };
//             return <TableRows key={typedUser.id} user={typedUser} index={index} />;
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const TableRows = ({ user, index }: { user: UserType; index: number }) => {
//   const rankOrdinal = numberToOrdinal(index + 1);
//   const highestRankOrdinal = numberToOrdinal(user.highestRank ?? null);

//   return (
//     <motion.tr layoutId={`row-${user.id}`} className={`text-sm ${Number(user.id) % 2 ? "bg-slate-300" : "bg-slate-200"}`}>
//       <td className="p-4 flex items-center gap-3 overflow-hidden">
//         {user.photoURL ? (
//           <Image src={user.photoURL} alt={`${user.name}'s image`} width={40} height={40} className="w-10 h-10 rounded-full bg-slate-300 object-cover object-top shrink-0" />
//         ) : (
//           <RxAvatar className="w-10 h-10 rounded-full bg-slate-300 object-cover object-top shrink-0" />
//         )}
//         <div>
//           <span className="block mb-1 font-medium">{user.name}</span>
//           <span className="block text-xs text-slate-500">{user.email}</span>
//         </div>
//       </td>

//       <td className="p-4">
//         <div className={`flex items-center gap-2 font-medium ${rankOrdinal === "1st" && "text-violet-500"}`}>
//           <span>{rankOrdinal}</span>
//           {rankOrdinal === "1st" && <FiAward className="text-xl" />}{" "}
//         </div>
//       </td>

//       <td className="p-4 font-medium">{highestRankOrdinal}</td>

//       <td className="p-4">
//         <span
//           className={`px-2 py-1 text-xs font-medium rounded ${
//             user.status === "online" ? "bg-green-200 text-green-800" : user.status === "offline" ? "bg-yellow-200 text-yellow-800" : "bg-slate-200 text-slate-800"
//           }`}
//         >
//           {user.status}
//         </span>
//       </td>
//     </motion.tr>
//   );
// };

// const numberToOrdinal = (n: number | null) => {
//   if (n === null) return "";

//   let ord = "th";

//   if (n % 10 == 1 && n % 100 != 11) {
//     ord = "st";
//   } else if (n % 10 == 2 && n % 100 != 12) {
//     ord = "nd";
//   } else if (n % 10 == 3 && n % 100 != 13) {
//     ord = "rd";
//   }

//   return n + ord;
// };

// // TODO get data from server
// // TODO track status
// const users = [
//   {
//     id: "1",
//     name: "Sergio",
//     email: "test@example.com",
//     photoURL: "",
//     highestRank: 112,
//     status: "online",
//   },
//   {
//     id: "2",
//     name: "Sunny",
//     email: "test@example.com",
//     photoURL: "",
//     highestRank: 41,
//     status: "online",
//   },
//   {
//     id: "3",
//     name: "Isabelle",
//     email: "test@example.com",
//     photoURL: "",
//     highestRank: 9,
//     status: "offline",
//   },

//   {
//     id: "4",
//     name: "Tim",
//     email: "test@example.com",
//     photoURL: "",
//     highestRank: 1,
//     status: "online",
//   },
//   {
//     id: "5",
//     name: "Christian",
//     email: "test@example.com",
//     photoURL: "",
//     highestRank: 9999,
//     status: "offline",
//   },
// ];
