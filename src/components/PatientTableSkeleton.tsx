import React from 'react';

interface PatientTableSkeletonProps {
  count?: number;
  showMobile?: boolean;
}

export const PatientTableSkeleton: React.FC<PatientTableSkeletonProps> = ({ 
  count = 5, 
  showMobile = true 
}) => {
  const SkeletonRow = ({ index }: { index: number }) => (
    <div 
      key={index}
      className="bg-white p-4 mb-4 rounded-lg shadow md:shadow-none md:rounded-none md:mb-0 md:grid md:grid-cols-[40px_minmax(180px,1.5fr)_110px_80px_minmax(200px,2.5fr)_minmax(150px,1.5fr)_120px_100px] md:gap-x-6 md:px-6 md:py-4 md:border-b items-center"
    >
      {/* STT (Desktop) */}
      <div className="hidden md:block text-center">
        <div className="h-4 bg-gray-200 rounded w-6 mx-auto animate-pulse" />
      </div>
      
      {/* Mobile Card View */}
      {showMobile && (
        <div className="md:hidden">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-1" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
            <div className="flex space-x-3">
              <div className="h-6 bg-gray-200 rounded w-12 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-12 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <div className="h-3 bg-gray-200 rounded w-8 animate-pulse mb-1" />
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-8 animate-pulse mb-1" />
              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
            </div>
            <div className="col-span-2">
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse mb-1" />
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
            <div className="col-span-2">
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse mb-1" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Table View */}
      <div className="hidden md:contents">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-8 animate-pulse mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-20 animate-pulse mx-auto" />
        <div className="flex justify-end space-x-4">
          <div className="h-6 bg-gray-200 rounded w-12 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-12 animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="md:border-t">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonRow key={index} index={index} />
      ))}
    </div>
  );
};

export const PatientFormSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-28 mb-2" />
        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
    </div>
    
    <div>
      <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
      <div className="h-20 bg-gray-200 rounded w-full" />
    </div>
    
    <div>
      <div className="h-4 bg-gray-200 rounded w-28 mb-2" />
      <div className="h-20 bg-gray-200 rounded w-full" />
    </div>
    
    <div className="flex justify-end space-x-3 pt-4">
      <div className="h-10 bg-gray-200 rounded w-16" />
      <div className="h-10 bg-gray-200 rounded w-20" />
    </div>
  </div>
);