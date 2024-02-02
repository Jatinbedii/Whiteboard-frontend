import JoinRoom from "@/components/JoinRoom";
export default function Home() {
  return (
    <main className="min-h-screen bg-blue-500">
      <div className="w-full bg-blue-500 flex justify-center">
        <div className="flex flex-col">
          <h1 className="text-black pt-2 text-3xl text-center md:text-6xl md:p-4">
            W H I T E B O A R D
          </h1>
          <div className="w-full text-center">
            <h2 className="text-black text-2xl p-2 md:text-4xl md:p-3">
              CHAT ROOM
            </h2>{" "}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <JoinRoom />
      </div>

      <div className="w-full text-center mt-[90px] md:text-xl pt-10">
        Made with &lt;3 by
        <span className="text-white font-medium"> Jatin Bedi</span>
      </div>
    </main>
  );
}
