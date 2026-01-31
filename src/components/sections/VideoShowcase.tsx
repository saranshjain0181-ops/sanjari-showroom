export default function VideoShowcase() {
  return (
    <section className="w-full bg-black">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-auto"
        style={{ objectFit: 'contain' }}
      >
        <source src="/brand-showcase.mp4" type="video/mp4" />
      </video>
    </section>
  );
}
