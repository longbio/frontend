'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense, useState } from 'react'
import ImageUploader from './components/ImageUploader'
import petPic from '../../../public/assets/images/pet.png'
import { MapPin, Calendar, Ruler, Instagram, Twitter, Facebook } from 'lucide-react'

function BioContent() {
  const [topImage, setTopImage] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  //   const value = `Lorem ipsum is a dummy or placeholder
  // text commonly used in graphic design, publishing, and web development to fill empty spaces in a layout that do not yet have content.`

  return (
    <div className="flex flex-col items-center justify-between w-full h-full pb-8 px-8">
      {/* NOTE: this is first design for biography summary */}
      <div className="flex flex-col items-center w-full">
        <div className="w-full h-40 rounded-b-[50px] overflow-hidden bg-gray-200">
          <ImageUploader
            image={topImage}
            setImage={setTopImage}
            className="w-full h-full object-cover cursor-pointer"
          />
        </div>
        <div className="w-28 h-28 border-1 border-white shadow -mt-18 rounded-full overflow-hidden">
          <ImageUploader
            image={profileImage}
            setImage={setProfileImage}
            className="w-full h-full object-cover border-2 border-white/20 overflow-hidden rounded-full cursor-pointer"
          />
        </div>
        <div className="mt-5 space-y-5">
          <div className="text-center">
            <h2 className="font-bold text-xl">
              Fari Zadeh{' '}
              <span className="font-normal text-gray-500 text-base">/ Graphic designer</span>
            </h2>
            <div className="flex justify-center gap-2 mt-2 text-gray-500 text-sm">
              <div className="flex gap-x-0.5 text-black bg-silva-mist px-2.5 py-1 rounded-2xl">
                <MapPin className="size-4" />
                <h1 className="text-xs font-light">Tehran, Iran</h1>
              </div>
              <div className="flex gap-x-1 text-black bg-silva-mist px-2.5 py-1 rounded-2xl">
                <Calendar className="size-4" />
                <h1 className="text-xs font-light">Age 27</h1>
              </div>
              <div className="flex gap-x-1 text-black bg-silva-mist px-2.5 py-1 rounded-2xl">
                <Ruler className="size-4" />
                <h1 className="text-xs font-light">159 cm, 58kg</h1>
              </div>
            </div>
            <span className="flex justify-center mt-3.5 text-black text-sm font-light">
              Woman / Married
            </span>
            <div className="flex justify-center gap-x-1.5 mt-3 text-xl">
              <div className="bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600 p-1.5 rounded-full">
                <Instagram className="size-4 text-white" />
              </div>
              <div className="bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600 p-1.5 rounded-full">
                <Twitter className="size-4 text-white" />
              </div>
              <div className="bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600 p-1.5 rounded-full">
                <Facebook className="size-4 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-4xl">
            <h1 className="text-base font-bold">Interests</h1>
            <div className="flex flex-wrap text-sm font-normal gap-2 mt-2">
              <span className="flex items-center border border-black bg-transparent gap-1 px-3 py-1 rounded-full">
                ☕ Coffee
              </span>
              <span className="flex items-center border border-black bg-transparent gap-1 px-3 py-1 rounded-full">
                🌸 Flowers & Gardening
              </span>
              <span className="flex items-center border border-black bg-transparent gap-1 px-3 py-1 rounded-full">
                🧘‍♀️ Meditation
              </span>
              <span className="flex items-center border border-black bg-transparent gap-1 px-3 py-1 rounded-full">
                📚 Books
              </span>
              <span className="flex items-center border border-black bg-transparent gap-1 px-3 py-1 rounded-full">
                🥾 Hiking
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-y-4 text-sm px-4.5">
            <div className="flex items-center gap-x-3">
              <h1 className="text-base font-bold">Date of birth:</h1>
              <span className="text-sm font-light">1997 / 02 / 04</span>
            </div>
            <div className="flex items-center gap-x-3">
              <h1 className="text-base text-nowrap font-bold">Job position:</h1>
              <h3 className="text-xs text-nowrap font-medium bg-silva-mist px-2 py-1 rounded-2xl">
                Graphic designer
              </h3>
              <span className="text-sm font-light">Director</span>
            </div>
            <div className="flex items-center gap-x-3">
              <h1 className="text-base font-bold">Exercise:</h1>
              <span className="text-sm font-light"> Hiking, Gym, Tennis</span>
            </div>
          </div>
          <div className="flex flex-1 justify-center h-28 mt-2">
            <div className="flex items-center w-full max-w-[55%] gap-x-2.5 md:gap-x-6 bg-gradient-to-r from-pink-100 to-purple-100/70 px-5 py-3 md:py-4 -mr-4 rounded-4xl">
              <div>
                <h1 className="text-base font-bold">Pets</h1>
                <h2 className="text-[10px] md:text-xs font-bold mt-1">Blacky</h2>
                <h2 className="text-[10px] md:text-xs text-nowrap font-light mt-1">
                  Scottish fold
                </h2>
                <h3 className="text-[10px] md:text-xs font-light">Age 3</h3>
              </div>
              <div className="size-16 md:size-[70px] mt-1.5 rounded-full overflow-hidden">
                <Image
                  src={petPic}
                  alt="pet picture"
                  width={70}
                  height={70}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center w-full max-w-[52%] h-full bg-gradient-to-r from-pink-100/65 to-purple-100 py-5 px-8 rounded-4xl">
              <h1 className="text-base font-bold">Skills</h1>
              <h2 className="text-xs md:text-sm font-normal mt-1">Swimming, Painting</h2>
              <h3 className="text-xs md:text-sm font-normal">Mathematics</h3>
            </div>
          </div>
          <div className="flex items-center text-sm mt-2 gap-x-5 px-4.5">
            <h1 className="text-base font-bold">Education:</h1>
            <span className="text-sm font-light">Bachelor&#39;s degree in graphics</span>
          </div>
          <div className="mt-4"></div>
        </div>
      </div>

      {/* NOTE: this is secend design for biography summary */}
      {/* <div className="flex flex-col items-center w-full">
        <div className="w-full h-40 rounded-b-[50px] overflow-hidden bg-gray-200">
          <ImageUploader
            image={topImage}
            setImage={setTopImage}
            className="w-full h-full object-cover cursor-pointer"
          />
        </div>
        <div className="w-28 h-28 border-1 border-white shadow -mt-18 rounded-full overflow-hidden">
          <ImageUploader
            image={profileImage}
            setImage={setProfileImage}
            className="w-full h-full object-cover border-2 border-white/20 overflow-hidden rounded-full cursor-pointer"
          />
        </div>
        <div className="flex flex-col w-full mt-5 gap-y-5">
          <div className="text-center">
            <h2 className="font-bold text-xl">
              Fari Zadeh{' '}
              <span className="font-normal text-gray-500 text-base">/ Graphic designer</span>
            </h2>
            <div className="flex justify-center gap-2 mt-2 text-gray-500 text-sm">
              <div className="flex gap-x-0.5 text-black bg-silva-mist px-2.5 py-1 rounded-2xl">
                <MapPin className="size-4" />
                <h1 className="text-xs font-light">Tehran, Iran</h1>
              </div>
              <div className="flex gap-x-1 text-black bg-silva-mist px-2.5 py-1 rounded-2xl">
                <Calendar className="size-4" />
                <h1 className="text-xs font-light">Age 27</h1>
              </div>
              <div className="flex gap-x-1 text-black bg-silva-mist px-2.5 py-1 rounded-2xl">
                <Ruler className="size-4" />
                <h1 className="text-xs font-light">159 cm, 58kg</h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-4 px-4.5 mt-4">
            <div className="flex items-center gap-x-5">
              <h1 className="text-base font-bold">Date of birth:</h1>
              <span className="text-sm font-light">1997 / 02 / 04</span>
            </div>
            <div className="flex items-start gap-x-8">
              <h1 className="text-base text-nowrap font-bold">Travel style:</h1>
              <div className="flex flex-col justify-end gap-2">
                <div className="flex gap-x-3.5">
                  <h3 className="text-xs font-medium bg-silva-mist px-2 py-1 rounded-2xl">
                    Backpacking
                  </h3>
                  <span className="text-sm text-nowrap font-light">Iran , Morocco</span>
                </div>
                <div className="flex gap-x-3.5">
                  <h3 className="text-xs font-medium bg-silva-mist px-2 py-1 rounded-2xl">
                    Volunteering
                  </h3>
                  <span className="text-sm text-nowrap font-light">Khorasan, Shiraz</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-16">
              <h1 className="text-base font-bold">Exercise:</h1>
              <span className="text-sm font-light"> Hiking, Gym, Tennis</span>
            </div>
          </div>
          <div className="flex flex-1 justify-center h-28 mt-2">
            <div className="flex items-center w-full max-w-[55%] gap-x-2.5 md:gap-x-6 bg-gradient-to-r from-pink-100 to-purple-100/70 px-5 py-3 md:py-4 -mr-4 rounded-4xl">
              <div>
                <h1 className="text-base font-bold">Pets</h1>
                <h2 className="text-[10px] md:text-xs font-bold mt-1">Blacky</h2>
                <h2 className="text-[10px] md:text-xs text-nowrap font-light mt-1">
                  Scottish fold
                </h2>
                <h3 className="text-[10px] md:text-xs font-light">Age 3</h3>
              </div>
              <div className="size-16 md:size-[70px] mt-1.5 rounded-full overflow-hidden">
                <Image
                  src={petPic}
                  alt="pet picture"
                  width={70}
                  height={70}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center w-full max-w-[52%] h-full bg-gradient-to-r from-pink-100/65 to-purple-100 py-5 px-8 rounded-4xl">
              <h1 className="text-base font-bold">Skills</h1>
              <h2 className="text-xs md:text-sm font-normal mt-1">Swimming, Painting</h2>
              <h3 className="text-xs md:text-sm font-normal">Mathematics</h3>
            </div>
          </div>
          <div className="flex items-center text-sm mt-2 gap-x-12 px-4.5">
            <h1 className="text-base font-bold">Education:</h1>
            <span className="text-sm font-light">Bachelor&#39;s degree in graphics</span>
          </div>
          <div className="flex gap-x-6 px-4.5">
            <h1 className="text-base text-nowrap font-bold">Job position:</h1>
            <div className="flex gap-x-3">
              <h3 className="text-xs text-nowrap font-medium bg-silva-mist px-2 py-1 rounded-2xl">
                Graphic designer
              </h3>
              <span className="text-sm font-light">Director</span>
            </div>
          </div>
          <div className="flex items-center h-24 gap-x-3 md:gap-x-6 pl-4.5">
            <h1 className="text-base text-nowrap font-bold">More about Fari:</h1>
            <textarea
              className="w-full h-full text-[9px] font-light border-1 border-black resize-none px-6 py-3 md:py-4 no-scrollbar  rounded-4xl"
              cols={7}
              readOnly
            >
              {value}
            </textarea>
          </div>
        </div>
      </div> */}

      {/* NOTE: this is Third design for biography summary */}
      {/* <div className="flex flex-col items-center w-full">
        <div className="w-full h-40 rounded-b-[50px] overflow-hidden bg-gray-200">
          <ImageUploader
            image={topImage}
            setImage={setTopImage}
            className="w-full h-full object-cover cursor-pointer"
          />
        </div>
        <div className="w-28 h-28 border-1 border-white shadow -mt-18 rounded-full overflow-hidden">
          <ImageUploader
            image={profileImage}
            setImage={setProfileImage}
            className="w-full h-full object-cover border-2 border-white/20 overflow-hidden rounded-full cursor-pointer"
          />
        </div>
        <div className="flex flex-col w-full mt-5 gap-y-5">
          <div className="text-center">
            <h2 className="font-bold text-xl">
              Fari Zadeh{' '}
              <span className="font-normal text-gray-500 text-base">/ Graphic designer</span>
            </h2>
            <div className="flex justify-center gap-2 mt-2 text-gray-500 text-sm">
              <div className="flex gap-x-0.5 text-black bg-silva-mist px-2.5 py-1 rounded-2xl">
                <MapPin className="size-4" />
                <h1 className="text-xs font-light">Tehran, Iran</h1>
              </div>
              <div className="flex gap-x-1 text-black bg-silva-mist px-2.5 py-1 rounded-2xl">
                <Calendar className="size-4" />
                <h1 className="text-xs font-light">Age 27</h1>
              </div>
              <div className="flex gap-x-1 text-black bg-silva-mist px-2.5 py-1 rounded-2xl">
                <Ruler className="size-4" />
                <h1 className="text-xs font-light">159 cm, 58kg</h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-4 px-4.5 mt-4">
            <div className="flex items-center gap-x-3">
              <h1 className="text-base font-bold">Date of birth:</h1>
              <span className="text-sm font-light">1997 / 02 / 04</span>
            </div>
            <div className="flex items-start gap-x-6">
              <h1 className="text-base text-nowrap font-bold">Travel style:</h1>
              <div className="flex flex-col justify-end gap-2">
                <div className="flex gap-x-3.5">
                  <h3 className="text-xs font-medium bg-silva-mist px-2 py-1 rounded-2xl">
                    Backpacking
                  </h3>{' '}
                  <span className="text-sm text-nowrap font-light">Iran , Morocco</span>
                </div>
                <div className="flex gap-x-3.5">
                  <h3 className="text-xs font-medium bg-silva-mist px-2 py-1 rounded-2xl">
                    Volunteering
                  </h3>{' '}
                  <span className="text-sm text-nowrap font-light">Khorasan, Shiraz</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-14">
              <h1 className="text-base font-bold">Exercise:</h1>
              <span className="text-sm font-light"> Hiking, Gym, Tennis</span>
            </div>
          </div>
          <div className="flex justify-between w-full bg-gradient-to-r from-pink-100/65 to-purple-100 py-5 px-8 rounded-4xl">
            <div className="flex flex-col basis-2/8">
              <h1 className="text-base font-bold">Skills</h1>
              <h2 className="text-sm font-normal mt-1">Swimming, Painting</h2>
              <h3 className="text-sm font-normal">Mathematics</h3>
            </div>
            <div className="flex flex-col justify-start gap-y-2 basis-5/8">
              <h1 className="text-base font-bold">More about Fari</h1>
              <p className="text-[9px] font-light leading-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut dicta quod culpa
                necessitatibus deserunt, cumque voluptates ea nam quia numquam corporis a ex magni
                modi totam commodi quis eligendi itaque!
              </p>
            </div>
          </div>
          <div className="flex items-center text-sm mt-2 gap-x-12 px-4.5">
            <h1 className="text-base font-bold">Education:</h1>
            <span className="text-sm font-light">Bachelor&#39;s degree in graphics</span>
          </div>
          <div className="flex gap-x-6 px-4.5">
            <h1 className="text-base text-nowrap font-bold">Job position:</h1>
            <div className="flex gap-x-3">
              <h3 className="text-xs text-nowrap font-medium bg-silva-mist px-2 py-1 rounded-2xl">
                Graphic designer
              </h3>{' '}
              <span className="text-sm font-light">Director</span>
            </div>
          </div>
        </div>
      </div> */}
      <div className="flex flex-col items-center w-full sticky bottom-0 mt-2 gap-y-1">
        <span className="text-[10px] font-bold">Do you want your own Long-bio Page?</span>
        <Link
          href="/"
          type="button"
          className="w-full h-fit bg-purple-blaze hover:bg-purple-blaze/90 transition text-white text-center text-base font-bold py-3 cursor-default rounded-full"
        >
          Let&#39;s have one!
        </Link>
      </div>
    </div>
  )
}

export default function Bio() {
  return (
    <Suspense>
      <BioContent />
    </Suspense>
  )
}
