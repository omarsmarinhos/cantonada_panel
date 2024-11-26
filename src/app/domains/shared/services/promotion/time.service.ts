import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  timePattern = /^(0[1-9]|1[0-2]):([0-5]\d)\s(AM|PM)$/;


  generateTimes(): string[] {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = ['00'];
    const times: string[] = [];

    hours.forEach((hour) => {
      minutes.forEach((minute) => {
        const formattedHour = String(hour % 12 || 12).padStart(2, '0');
        const amPm = hour < 12 ? 'AM' : 'PM';
        times.push(`${formattedHour}:${minute} ${amPm}`);
      });
    });

    return times;
  }

  convertTo24HourFormat(time: string): string {
    const [hourMinute, amPm] = time.split(' ');
    const [hour, minute] = hourMinute.split(':').map(Number);

    let convertedHour = hour;
    if (amPm === 'AM' && hour === 12) {
      convertedHour = 0;
    } else if (amPm === 'PM' && hour !== 12) {
      convertedHour = hour + 12;
    }

    return `${String(convertedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  convertTo12HourFormat(time: string | undefined): string {
    if (!time) return '';
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    let amPm = 'AM';
    if (hour >= 12) {
      amPm = 'PM';
    }

    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour -= 12;
    }

    const formattedHour = hour.toString();
    const formattedMinute = minute.toString().padStart(2, '0');

    return `${String(formattedHour).padStart(2, '0')}:${String(formattedMinute).padStart(2, '0')} ${amPm}`;
  }
}
