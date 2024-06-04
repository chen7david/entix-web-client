export const Home = () => {
  return (
    <div className="flex md:flex-row flex-col">
      <div className="">
        {Array.from(new Array(100)).map((_, i) => (
          <div key={i} className="border-b p-4">
            <h1 className="text-2xl font-bold">Title</h1>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem, quibusdam.
            </p>
          </div>
        ))}
      </div>
      <div className="">
        {Array.from(new Array(1)).map((_, i) => (
          <div key={i} className="border-b p-4">
            <h1 className="text-2xl font-bold">Title</h1>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem, quibusdam.
            </p>
          </div>
        ))}
      </div>
      <div className="">
        {Array.from(new Array(1)).map((_, i) => (
          <div key={i} className="border-b p-4">
            <h1 className="text-2xl font-bold">Title</h1>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem, quibusdam.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
