import ShaderToyCanvas from "@/components/ShaderToyCanvas";

export default function ShaderPage() {
  return (
    <main className="flex items-center justify-center h-screen bg-black">
      <div className="relative w-full h-full">
        <ShaderToyCanvas />
      </div>
    </main>
  );
}
