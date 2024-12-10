import ImageUi from "../../../static/Images/Ui2.png";

export default function About() {
  return (
    <section id="about" className="py-24 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <img
            src={ImageUi}
            alt="MusicVista team in a music academy setting"
            // className="rounded-lg shadow-xl"
            width={600}
            height={400}
          />
        </div>
        <div className="md:w-1/2 lg:ml-3">
          <h2 className="text-3xl font-bold mb-6">About Us</h2>
          <p className="text-lg mb-4 text-justify">
            At MusicVista, we're passionate about empowering music educators and
            academy administrators. Our team of musicians and tech experts have
            created a comprehensive management solution that harmonizes the art
            of teaching with the science of efficient administration.
          </p>
          <p className="text-lg text-justify">
            With years of experience in both music education and software
            development, we understand the unique challenges faced by music
            academies. Our mission is to provide you with the tools you need to
            focus on what really matters - nurturing musical talent and
            inspiring the next generation of artists.
          </p>
        </div>
      </div>
    </section>
  );
}
