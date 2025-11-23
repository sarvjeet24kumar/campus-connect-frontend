import { format } from 'date-fns';

const formatDate = value => {
  try {
    return format(new Date(value), 'MMM dd, yyyy hh:mm a');
  } catch (error) {
    return value;
  }
};

const EventCard = ({ event, badge, actions, children }) => (
  <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
    <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="max-w-88 text-lg font-semibold text-slate-800 break-all">
          {event.title}
        </h3>

        {/* <textarea name="" id="">
          {event.title}
        </textarea> */}
        {badge && (
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-600 break-all">{event.description}</p>
    </div>
    <div className="flex flex-col gap-2 px-5 py-4 text-sm text-slate-600">
      <div className="flex items-center justify-between">
        <span className="font-medium text-slate-700">Starts</span>
        <span>{formatDate(event.start_time)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-medium text-slate-700">Ends</span>
        <span>{formatDate(event.end_time)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-medium text-slate-700">Location</span>
        <span>{event.location_name || event.location_display}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-medium text-slate-700">Seats Left</span>
        <div className="flex items-center gap-2">
          {event.available_seats > 10 && (
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
          )}
          {event.available_seats <= 10 && event.available_seats > 0 && (
            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
          )}
          {event.available_seats === 0 && (
            <div className="h-2 w-2 rounded-full bg-rose-500"></div>
          )}
          <span
            className={
              event.available_seats > 10
                ? 'text-emerald-600'
                : event.available_seats > 0
                ? 'text-amber-600'
                : 'text-rose-600'
            }
          >
            {event.available_seats === 0 ? 'Full' : event.available_seats}
          </span>
        </div>
      </div>
      {children}
    </div>
    {actions && (
      <div className="mt-auto border-t border-slate-100 px-5 py-3">
        {actions}
      </div>
    )}
  </div>
);

export default EventCard;
