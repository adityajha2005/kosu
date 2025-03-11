"use client";

import ResourcesPage from '@/components/Resources';
import React from 'react';

function Resources() {
  const eventId = "someEventId"; // Replace with actual event ID
  const userId = "someUserId";   // Replace with actual user ID

  return (
    <div>
      <ResourcesPage eventId={eventId} userId={userId} />
    </div>
  );
}

export default Resources;
