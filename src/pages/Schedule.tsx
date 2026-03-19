import React from 'react';
import { Calendar, Clock, MapPin, User, Phone, MessageCircle } from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';

export function Schedule() {
  const now = new Date();
  const nextWeek = addDays(now, 7);
  const { properties } = useProperties();

  const upcomingVisits = properties
    .filter(p => p.visitTime && isAfter(new Date(p.visitTime), now) && isBefore(new Date(p.visitTime), nextWeek))
    .sort((a, b) => new Date(a.visitTime!).getTime() - new Date(b.visitTime!).getTime());

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Property Visits</h1>
          <p className="text-slate-500 mt-1">Manage your upcoming schedule and reminders.</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm">
          Schedule Visit
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" /> Upcoming 7 Days
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {upcomingVisits.map(property => {
            const visitDate = new Date(property.visitTime!);
            const whatsappMsg = encodeURIComponent(`Hi ${property.ownerName}, confirming our visit for ${property.title} at ${format(visitDate, 'h:mm a')}.`);

            return (
              <div key={property.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6">
                {/* Time Column */}
                <div className="md:w-48 flex flex-col items-start md:items-end md:pr-6 md:border-r border-slate-200">
                  <div className="bg-blue-50 text-blue-900 px-4 py-2 rounded-xl font-bold text-lg border border-blue-100 shadow-sm">
                    {format(visitDate, 'MMM d')}
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 text-slate-600 font-medium">
                    <Clock className="w-4 h-4" /> {format(visitDate, 'h:mm a')}
                  </div>
                </div>

                {/* Details Column */}
                <div className="flex-1 space-y-4">
                  <div>
                    <Link to={`/property/${property.id}`} className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1">
                      {property.title}
                    </Link>
                    <div className="flex items-center gap-2 text-slate-500 mt-1 text-sm">
                      <MapPin className="w-4 h-4" /> {property.location}
                    </div>
                  </div>

                  <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{property.ownerName}</p>
                        <p className="text-sm text-slate-500">Owner</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <a 
                        href={`tel:${property.phoneNumber}`}
                        className="p-2 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                        title="Call Owner"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <a 
                        href={`https://wa.me/${property.whatsappNumber}?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors shadow-sm"
                        title="WhatsApp Owner"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {upcomingVisits.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No upcoming visits scheduled for the next 7 days.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
