import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-tci-dark text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About TCI</h3>
            <p className="text-sm opacity-80">
              The Corporate Intelligence - Empowering strategic thinking through Go.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Learn Go</h3>
            <p className="text-sm opacity-80">
              Master the ancient game of strategy and develop your tactical thinking.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/img/tci-photo.jpg"
              alt="TCI Team"
              width={200}
              height={120}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm opacity-60">
          © 2024 TCI - The Corporate Intelligence
        </div>
      </div>
    </footer>
  )
}













