import logo from "@/assets/logo2.png";
import logoTitle from "@/assets/img/logo-title.png";
import jabeCopy from "@/assets/img/jabe copy.png";
import jabiii from "@/assets/img/jabiii.png";

import img1 from "@/assets/img/left1st.png";
import img2 from "@/assets/img/right1st.png";
import img3 from "@/assets/img/middle1st.png";
import img4 from "@/assets/img/left2nd.png";
import img5 from "@/assets/img/midde2nd.png";
import img6 from "@/assets/img/left3th.png";
import img7 from "@/assets/img/middle3th.png";
import img8 from "@/assets/img/leftl3th.png";
import img9 from "@/assets/img/rightr3th.png";
import img10 from "@/assets/img/right3th.png";
import img11 from "@/assets/img/middle4th.png";
import img12 from "@/assets/img/left4th.png";
import img13 from "@/assets/img/left5th.png";
import img14 from "@/assets/img/right5th.png";

import tl1 from "@/assets/img/4.png";
import tl2 from "@/assets/img/5.png";
import tl3 from "@/assets/img/6.png";
import tl4 from "@/assets/img/3.png";
import tl5 from "@/assets/img/7.png";

type TL = { id: string; img: string; name: string; role: string };
type SectionProps = {
  title: string;
  desc: string;
  images: [string, ...string[]];
  red?: boolean;
};

const drumPattern =
  "url('data:image/svg+xml;utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%27120%27%3E%3Cpath d=%27M20 30 C40 0 80 0 100 30 C110 40 110 70 100 90 C80 110 40 110 20 90 C10 70 10 40 20 30 Z%27 stroke=%27%23ffffff%27 stroke-width=%273%27 fill=%27none%27 opacity=%270.08%27/%3E%3C/svg%3E')]";

export default function HomePage() {
  const tls: TL[] = [
    { id: "tl1", img: tl1, name: "Ann", role: "Counter" },
    { id: "tl2", img: tl2, name: "Lyn", role: "Counter" },
    { id: "tl3", img: tl3, name: "JM", role: "Dining" },
    { id: "tl4", img: tl4, name: "Rei", role: "Dining" },
    { id: "tl5", img: tl5, name: "Dess", role: "Kitchen" },
  ];

  return (
    <div className="font-poppins text-gray-900 bg-white">
      <TopBar />
      <Hero />
      <TLBar tls={tls} />
      <Section
        title="WELCOMING SMILES AS COUNTER TEAM!"
        desc="The face of Jollibee! Our Counter Team delivers warm welcomes, friendly service, and joyful smiles with every order. Be the reason why every customer's day gets brighter."
        images={[img1, img3, img2]}
      />

      <div className="flex flex-col gap-4">
        <Section
          title="DELIGHTFUL MOMENTS AS DINING TEAM!"
          desc="Keeping the heart of Jollibee vibrant, the Dining Team ensures guests enjoy a clean, fun, and family-friendly experience. Here, every table served is a moment of joy created."
          images={[img4, img5]}
          red
        />
        <Gallery images={[img6, img7, img8, img9, img10]} />
        <Section
          title="FUN EXPERIENCE AS KITCHEN TEAM!"
          desc="Behind every world-famous Chickenjoy is a passionate Kitchen Team. With skill, teamwork, and dedication, they bring delicious meals to life—turning simple ingredients into fun moments."
          images={[img11, img12]}
          red
        />
        <Section
          title="ROLLING THE JOY AS DRIVE-THRU TEAM!"
          desc="Fast, fun, and full of energy! The Drive-Thru Team keeps the joy rolling! Making every order on-the-go feel just as special as dining in."
          images={[img13, img14]}
        />
      </div>
      <Footer />
    </div>
  );
}

function TopBar() {
  return (
    <div className="bg-[#EA0038]  ">
      <div className="max-w-[1200px] mx-auto text-white px-6 sm:px-12 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="h-12 sm:h-16 " />
        </div>
        <div className="text-xl sm:text-2xl font-semibold">
          Thanks for Visiting!
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-[1200px] mx-auto py-12 px-6">
      <div className="flex-1 min-w-[300px] text-center md:text-left">
        <div className="inline-block bg-[#EA0038] text-white px-8 py-3 rounded-full lg:rounded-r-full text-2xl font-extrabold mb-4">
          WELCOME TO
        </div>
        <div className="flex justify-center md:justify-end">
          <img
            src={logoTitle}
            alt="Jollibee Logo"
            className="w-64 sm:w-80 md:w-96"
          />
        </div>
        <p className="mt-6 text-lg sm:text-xl md:text-2xl leading-relaxed text-center md:text-left">
          Where joy isn’t just served, it’s shared. Jollibee XRC Square Montaña
          is more than a workplace—it's a family built on teamwork, growth, and
          happiness. Here, every role is meaningful, every smile matters, and
          every moment is an opportunity to bring joy to others. Join us and
          discover how you can build a rewarding career while spreading
          happiness the Jollibee way.
        </p>
      </div>
      <div className="relative flex justify-center md:justify-end w-full md:w-[520px]">
        <div className="w-[320px] sm:w-[420px] md:w-[520px] h-[320px] sm:h-[420px] md:h-[520px] overflow-hidden flex items-end justify-center">
          <img
            src={jabeCopy}
            alt="Building"
            className="object-cover w-full h-full"
          />
        </div>
        <img
          src={jabiii}
          alt="Mascot"
          className="absolute bottom-0 md:-right-28 w-40 sm:w-60 md:w-80 drop-shadow-xl"
        />
      </div>
    </section>
  );
}

function TLBar({ tls }: { tls: TL[] }) {
  return (
    <section
      className="bg-[#EA0038] text-white py-10 text-center"
      style={{ backgroundImage: drumPattern }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-8">MEET OUR TL's</h2>
      <div className="flex flex-wrap justify-center gap-10">
        {tls.map((tl) => (
          <div key={tl.id} className="flex flex-col items-center w-28 sm:w-32">
            <div className="w-24 h-24 rounded-full bg-white overflow-hidden shadow-lg mb-3">
              <img
                src={tl.img}
                alt={tl.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="font-extrabold text-lg">{tl.name}</div>
            <div className="text-sm opacity-90">{tl.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Section({ title, desc, images, red = false }: SectionProps) {
  return (
    <section
      className={`flex flex-col md:flex-row items-center justify-center gap-8 py-12 px-6 ${
        red ? `bg-[#EA0038] text-white rounded-2xl` : "bg-white text-gray-900"
      }`}
      style={red ? { backgroundImage: drumPattern } : undefined}
    >
      <div className="flex justify-center md:w-1/2 flex-wrap gap-4">
        {images.map((src, i) => (
          <div
            key={i}
            className=" shadow-lg rounded-md overflow-hidden w-48 sm:w-56 md:w-60"
          >
            <img src={src} alt="Team" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="flex-1 text-center md:text-left max-w-xl">
        <h3
          className={`inline-block font-bold text-xl sm:text-2xl px-6 py-2 rounded-full mb-4 ${
            red ? "bg-white text-[#EA0038]" : "bg-[#EA0038] text-white"
          }`}
        >
          {title}
        </h3>
        <p className="text-base sm:text-lg leading-relaxed">{desc}</p>
      </div>
    </section>
  );
}

function Gallery({ images }: { images: string[] }) {
  return (
    <div
      className="bg-[#EA0038] py-10 px-6 flex flex-wrap justify-center gap-8 rounded-xl relative"
      style={{ backgroundImage: drumPattern }}
    >
      {images.map((src, i) => {
        // Custom rotations and translations to mimic screenshot
        const rotate = ["-10deg", "-5deg", "0deg", "5deg", "10deg"][i % 5];
        const translateY = [-10, -5, 0, 5, 10][i % 5]; // vertical shift
        const zIndex = 5 - (i % 5); // overlapping order

        return (
          <div
            key={i}
            className="border-4 border-white rounded-md overflow-hidden w-40 sm:w-48 md:w-56 shadow-lg"
            style={{
              transform: `rotate(${rotate}) translateY(${translateY}px)`,
              zIndex,
              transition: "transform 0.3s",
            }}
          >
            <img
              src={src}
              alt="Gallery"
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}

function Footer() {
  return (
    <footer className="text-center text-gray-900 py-8 border-t-4 border-[#EA0038] relative overflow-hidden">
      <p className="text-lg sm:text-xl">
        For faster processing, submit your resume personally at our store and
        approach any available Team Leader (TL).
      </p>
      <p className="text-sm mt-3">
        © 2025 Jollibee Foods Corporation. All rights reserved.
      </p>
      <div className="absolute right-0 bottom-0 w-48 h-48 bg-gradient-to-b from-yellow-300 to-orange-600 rounded-full opacity-90 translate-x-1/3 translate-y-1/3"></div>
    </footer>
  );
}
