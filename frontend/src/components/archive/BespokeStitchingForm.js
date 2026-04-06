import React, { useState } from 'react';

const measurementFields = [
    { key: 'bust', label: 'Bust', hint: 'Measure around the fullest part of your chest' },
    { key: 'aboveWaist', label: 'Above Waist', hint: 'Measure just above your natural waist' },
    { key: 'naturalWaist', label: 'Natural Waist', hint: 'Measure around your natural waistline' },
    { key: 'hip', label: 'Hip Circumference', hint: 'Measure around the fullest part of your hips' },
    { key: 'blouseLength', label: 'Blouse Length', hint: 'From shoulder to waist' },
    { key: 'shoulder', label: 'Shoulder Width', hint: 'Tip to tip across the shoulders' },
    { key: 'sleeveLength', label: 'Sleeve Length', hint: 'From shoulder tip to wrist' },
    { key: 'armhole', label: 'Armhole Round', hint: 'Measure around the armhole opening' },
    { key: 'skirtLength', label: 'Lehenga / Skirt Length', hint: 'From waist to ankle' },
    { key: 'dupatta', label: 'Dupatta Note', hint: 'Special hemming instructions or preferences', isText: true },
];

const BespokeStitchingForm = ({ onMeasurementsChange }) => {
    const [stitchingOption, setStitchingOption] = useState('standard'); // 'standard' | 'bespoke'
    const [unit, setUnit] = useState('cm');
    const [measurements, setMeasurements] = useState({});
    const [saveToAccount, setSaveToAccount] = useState(false);
    const [guideField, setGuideField] = useState(null);

    const handleMeasurementChange = (key, value) => {
        const updated = { ...measurements, [key]: value };
        setMeasurements(updated);
        onMeasurementsChange?.({ ...updated, stitchingOption, unit });
    };

    return (
        <div className="space-y-6 border-t border-bronze/10 pt-8">
            {/* Section Label */}
            <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-gold">
                Stitching Option
            </h3>

            {/* Option Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Standard */}
                <button
                    type="button"
                    onClick={() => { setStitchingOption('standard'); onMeasurementsChange?.({ stitchingOption: 'standard' }); }}
                    className={`text-left p-5 border-2 transition-all duration-300 ${stitchingOption === 'standard'
                        ? 'border-bronze bg-bronze/5'
                        : 'border-bronze/20 hover:border-bronze/50'}`}
                >
                    <div className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${stitchingOption === 'standard' ? 'border-bronze' : 'border-bronze/30'}`}>
                            {stitchingOption === 'standard' && <div className="w-2 h-2 rounded-full bg-bronze" />}
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-bronze mb-1">Standard Size</p>
                            <p className="text-[10px] text-bronze/50 leading-relaxed">
                                Ready-to-wear in standard Indian sizing (XS–3XL) — ships within 5–7 days.
                            </p>
                        </div>
                    </div>
                </button>

                {/* Bespoke */}
                <button
                    type="button"
                    onClick={() => { setStitchingOption('bespoke'); onMeasurementsChange?.({ stitchingOption: 'bespoke' }); }}
                    className={`text-left p-5 border-2 relative transition-all duration-300 ${stitchingOption === 'bespoke'
                        ? 'border-gold bg-gold/5'
                        : 'border-bronze/20 hover:border-gold/50'}`}
                >
                    {/* Most Popular ribbon */}
                    <span className="absolute -top-2 right-4 px-3 py-0.5 bg-gold text-chocolate text-[7px] font-black uppercase tracking-widest">
                        Most Popular
                    </span>
                    <div className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${stitchingOption === 'bespoke' ? 'border-gold' : 'border-bronze/30'}`}>
                            {stitchingOption === 'bespoke' && <div className="w-2 h-2 rounded-full bg-gold" />}
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-bronze mb-1">Bespoke Custom Stitched</p>
                            <p className="text-[10px] text-bronze/50 leading-relaxed">
                                Tailored precisely to your body measurements — ships within 15–21 days.
                            </p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Measurement Form — expands when Bespoke is selected */}
            <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${stitchingOption === 'bespoke' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="pt-6 space-y-6">
                    {/* How to measure + unit toggle */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-bronze/10">
                        <button
                            type="button"
                            onClick={() => setGuideField('overview')}
                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold hover:text-bronze transition-colors"
                        >
                            <span className="material-symbols-outlined text-base">straighten</span>
                            How To Measure Guide
                        </button>
                        <div className="flex items-center gap-1 border border-bronze/20 p-0.5">
                            {['cm', 'in'].map((u) => (
                                <button
                                    key={u}
                                    type="button"
                                    onClick={() => setUnit(u)}
                                    className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${unit === u ? 'bg-bronze text-champagne' : 'text-bronze/50 hover:text-bronze'}`}
                                >
                                    {u}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Measurement Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        {measurementFields.map((field) => (
                            <div key={field.key} className={field.isText ? 'col-span-2' : ''}>
                                <div className="flex items-center justify-between mb-2">
                                    <label
                                        htmlFor={`meas-${field.key}`}
                                        className="text-[9px] font-black uppercase tracking-[0.4em] text-bronze/60"
                                    >
                                        {field.label}
                                    </label>
                                    <button
                                        type="button"
                                        title={field.hint}
                                        onClick={() => setGuideField(field.key)}
                                        className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-gold/70 hover:text-gold transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm" style={{ fontSize: '14px' }}>help_outline</span>
                                        measure
                                    </button>
                                </div>
                                {field.isText ? (
                                    <textarea
                                        id={`meas-${field.key}`}
                                        placeholder={field.hint}
                                        rows={2}
                                        value={measurements[field.key] || ''}
                                        onChange={(e) => handleMeasurementChange(field.key, e.target.value)}
                                        className="w-full bg-white/40 border-0 border-b border-bronze/20 py-3 px-0 text-[11px] text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors resize-none font-medium"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <input
                                            id={`meas-${field.key}`}
                                            type="number"
                                            placeholder={`e.g. ${unit === 'cm' ? '84' : '33'}`}
                                            value={measurements[field.key] || ''}
                                            onChange={(e) => handleMeasurementChange(field.key, e.target.value)}
                                            className="flex-1 bg-transparent border-0 border-b border-bronze/20 py-3 px-0 text-[12px] text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors font-bold"
                                        />
                                        <span className="text-[9px] font-bold text-bronze/30 uppercase">{unit}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Save measurements checkbox */}
                    <label className="flex items-center gap-3 cursor-pointer group pt-2">
                        <input
                            type="checkbox"
                            checked={saveToAccount}
                            onChange={(e) => setSaveToAccount(e.target.checked)}
                            className="w-4 h-4 border-bronze/20 text-gold focus:ring-gold accent-gold"
                        />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50 group-hover:text-bronze transition-colors">
                            Save measurements to my account for future orders
                        </span>
                    </label>
                </div>
            </div>

            {/* How To Measure Modal */}
            {guideField && (
                <div
                    className="fixed inset-0 bg-chocolate/80 backdrop-blur-sm z-[500] flex items-center justify-center p-8"
                    onClick={() => setGuideField(null)}
                >
                    <div
                        className="bg-champagne max-w-lg w-full p-12 space-y-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setGuideField(null)}
                            className="absolute top-6 right-6 text-bronze/40 hover:text-gold transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-gold">Measurement Guide</span>
                        <h3 className="text-3xl font-editorial font-black text-bronze uppercase">
                            {guideField === 'overview' ? 'How To Measure' : measurementFields.find(f => f.key === guideField)?.label}
                        </h3>
                        <p className="text-sm text-bronze/70 leading-relaxed">
                            {guideField === 'overview'
                                ? 'For the most accurate fit, use a soft measuring tape and measure against your bare skin or lightweight undergarments. Stand naturally and do not hold your breath. Have a friend assist for best results.'
                                : measurementFields.find(f => f.key === guideField)?.hint}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-bronze/40">
                            All measurements should be taken in centimeters unless otherwise specified.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BespokeStitchingForm;
