import { PageContainer } from '@/components/Layout/PageContainer'
import { Toolbar } from '@/components/Layout/Toolbar'

export const Home = () => {
  return (
    <>
      <Toolbar className="bg-white shadow-sm">
        {/* add content here ... */}
      </Toolbar>
      <PageContainer className="flex md:flex-row flex-col gap-4">
        <div className="">
          {Array.from(new Array(100)).map((_, i) => (
            <div key={i} className="border-b p-4">
              <h1 className="text-2xl font-bold">Home</h1>
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
      </PageContainer>
    </>
  )
}
