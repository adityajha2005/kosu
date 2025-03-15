import { JobMatch } from '../types/aiAgent';

interface JobCardProps {
  job: JobMatch;
  onApply: (job: JobMatch) => void;
}

export default function JobCard({ job, onApply }: JobCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-blue-400">{job.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          job.matchPercentage >= 80 ? 'bg-green-500/20 text-green-400' : 
          job.matchPercentage >= 60 ? 'bg-blue-500/20 text-blue-400' :
          'bg-yellow-500/20 text-yellow-400'
        }`}>
          {job.matchPercentage}% Match
        </span>
      </div>
      
      <p className="text-gray-400 text-sm">{job.company} • {job.location}</p>
      <p className="text-gray-300 text-sm mt-2 line-clamp-2">{job.description}</p>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {job.skills?.map((skill, index) => (
          <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
            {skill}
          </span>
        ))}
      </div>
      
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onApply(job)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Apply Now
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
          Save
        </button>
      </div>
    </div>
  );
} 