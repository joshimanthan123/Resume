import { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const maxChars = 300;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setFormSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setFormSubmitted(false);
  };

  return (
    <div className="bg-background dark:bg-inverse-surface/10 py-24 min-h-[85vh] duration-300">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        
        {/* Title Area */}
        <div className="text-center max-w-2xl mx-auto mb-16 relative">
          <h2 className="font-headline-md text-[32px] md:text-[40px] text-on-surface dark:text-white mb-4 font-bold">
            Get in Touch
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300">
            Have an interesting project or summer internship opportunity? Let's connect!
          </p>

          {/* Help Tooltip Trigger */}
          <button 
            type="button" 
            onClick={() => setShowHelp(!showHelp)}
            className="mt-4 px-4 py-2 bg-surface-container dark:bg-outline/20 text-primary dark:text-[#5c8bee] hover:bg-primary-fixed hover:text-on-primary-fixed-variant dark:hover:bg-outline/35 rounded-full font-label-sm text-xs flex items-center justify-center gap-1.5 mx-auto transition-all"
            aria-label="Toggle Form Help"
          >
            <span className="material-symbols-outlined text-[16px]">info</span>
            {showHelp ? "Hide Form Instructions" : "Show Form Instructions"}
          </button>

          {/* Help Information Box (useState toggle) */}
          {showHelp && (
            <div className="mt-4 p-4 max-w-md mx-auto bg-primary-fixed dark:bg-primary/20 text-on-primary-fixed-variant dark:text-[#b4c5ff] rounded-xl border border-primary/20 text-left text-xs space-y-2 animate-fade-in shadow-md">
              <p className="font-bold">📩 Tips for getting in touch:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Double check your email address for direct replies.</li>
                <li>Please describe details of the position or collaboration idea.</li>
                <li>Messages have a maximum length limit of 300 characters.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Contact Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          {/* Controlled Form Card */}
          <div className="lg:col-span-7 glass-card p-8 rounded-2xl shadow-sm dark:bg-inverse-surface/80">
            {formSubmitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-green-150 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                  <span className="material-symbols-outlined text-[36px]">check_circle</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-on-surface dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-sm text-on-surface-variant dark:text-gray-300">
                    Thank you, {name}. I will get back to you within 24 hours.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-lg font-label-sm text-xs transition-all shadow-md"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-on-surface dark:text-gray-200">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-white dark:bg-inverse-surface border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-on-surface dark:text-gray-200">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white dark:bg-inverse-surface border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-on-surface dark:text-gray-200">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows="5"
                    maxLength={maxChars}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full px-4 py-3 bg-white dark:bg-inverse-surface border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400 resize-none"
                  ></textarea>
                  
                  {/* Live Character Count */}
                  <div className="flex justify-between items-center text-xs text-on-surface-variant dark:text-gray-400">
                    <span>Write up to {maxChars} characters max.</span>
                    <span className={message.length >= maxChars - 20 ? "text-red-500 font-bold" : ""}>
                      {message.length} / {maxChars}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full btn-pulse py-4 bg-primary text-on-primary font-label-sm text-sm rounded-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  Send Message
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
            )}
          </div>

          {/* Live Preview Card */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="block text-xs font-bold uppercase tracking-wider text-on-surface dark:text-gray-200">
              Live Preview
            </h3>
            
            <div className="p-6 bg-surface-container-low dark:bg-inverse-surface border border-outline-variant dark:border-outline/35 rounded-2xl shadow-sm min-h-[300px] flex flex-col justify-between">
              <div>
                {/* Header Profile preview */}
                <div className="flex items-center gap-3 border-b dark:border-outline/25 pb-4 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary dark:text-[#5c8bee]">
                    <span className="material-symbols-outlined">mail_outline</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface dark:text-white">
                      {name || <span className="text-gray-450 italic font-normal">Anonymous Sender</span>}
                    </h4>
                    <p className="text-xs text-on-surface-variant dark:text-gray-400 truncate max-w-[200px]">
                      {email || <span className="text-gray-450 italic font-normal">no-email@configured.com</span>}
                    </p>
                  </div>
                </div>

                {/* Preview Message */}
                <div className="space-y-2">
                  <span className="bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded">
                    Message Body
                  </span>
                  <p className="text-sm text-on-surface dark:text-gray-200 break-words whitespace-pre-wrap leading-relaxed min-h-[100px]">
                    {message || <span className="text-gray-400 italic">No message drafted yet. Start typing inside the form on the left to see this preview update in real time...</span>}
                  </p>
                </div>
              </div>

              {/* Status footer preview */}
              <div className="text-[10px] text-on-surface-variant dark:text-gray-400 text-right uppercase tracking-wider mt-4">
                Draft Status: {message.length > 0 ? "In Progress" : "Empty"}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
